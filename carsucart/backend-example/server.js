const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001; 

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/products/';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// ------------------------------------------------------------------
// AUTH MIDDLEWARE (Sanctum Compatible)
// ------------------------------------------------------------------
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const tokenString = authHeader.split(' ')[1];
    if (!tokenString.includes('|')) {
         return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
    }

    const [tokenId, plainToken] = tokenString.split('|');

    try {
        const [rows] = await db.execute(
            'SELECT * FROM personal_access_tokens WHERE id = ?',
            [tokenId]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        const tokenRecord = rows[0];
        const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');

        if (hashedToken !== tokenRecord.token) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token hash' });
        }
        
        // Check expiration if needed (skipped for now as per schema nullable)

        req.user = { id: tokenRecord.tokenable_id, type: tokenRecord.tokenable_type };
        next();

    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ------------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Node.js Order Service is running' });
});

/**
 * CATEGORIES
 */
app.get('/api/categories', async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT id, name FROM categories ORDER BY name ASC');
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('[Category API] Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

/**
 * PRODUCT MANAGEMENT (Seller & Public)
 */

// GET /api/products - Public List
app.get('/api/products', async (req, res) => {
    try {
        const { q, category } = req.query;
        let query = `
            SELECT p.*, c.name as category, u.name as sellerName 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            LEFT JOIN users u ON p.seller_id = u.id
        `;
        const params = [];
        const conditions = [];

        if (q) {
            conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
            params.push(`%${q}%`, `%${q}%`);
        }
        
        if (category) {
            conditions.push('c.name = ?');
            params.push(category);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY p.created_at DESC';

        const [products] = await db.execute(query, params);
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('[Product API] Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /api/my-products - Seller's Products
app.get('/api/my-products', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const [products] = await db.execute(`
            SELECT p.*, c.name as category 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.seller_id = ? 
            ORDER BY p.created_at DESC
        `, [userId]);
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('[Product API] My Products Error:', error);
        res.status(500).json({ error: 'Failed to fetch your products' });
    }
});

// GET /api/products/:id - Single Product Details
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute(`
            SELECT p.*, c.name as category, u.name as sellerName 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON p.seller_id = u.id 
            WHERE p.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('[Product API] Get Single Error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// POST /api/products - Create Product (Seller)
app.post('/api/products', authenticate, upload.single('image'), async (req, res) => {
    const conn = await db.getConnection();
    try {
        const userId = req.user.id;
        
        // Check if user is seller (optional, but good)
        const [userCheck] = await conn.execute('SELECT role FROM users WHERE id = ?', [userId]);
        if (userCheck.length === 0 || userCheck[0].role !== 'seller') {
            return res.status(403).json({ error: 'Only sellers can add products.' });
        }

        const { name, description, price, stock, category_id, sku, brand } = req.body;
        
        // Image URL handling
        let imageUrl = null;
        if (req.file) {
            // Store relative path for flexibility (frontend can prepend base URL)
            imageUrl = `/uploads/products/${req.file.filename}`;
        }

        const [result] = await conn.execute(
            `INSERT INTO products (seller_id, name, description, price, stock, category_id, sku, brand, image_url, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [userId, name, description, price, stock, category_id || 1, sku || null, brand || null, imageUrl]
        );

        res.status(201).json({ success: true, message: 'Product created successfully', productId: result.insertId });

    } catch (error) {
        console.error('[Product API] Create Error:', error);
        res.status(500).json({ error: 'Failed to create product' });
    } finally {
        conn.release();
    }
});

// PUT /api/products/:id - Update Product (Seller/Admin)
app.put('/api/products/:id', authenticate, upload.single('image'), async (req, res) => {
    const conn = await db.getConnection();
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name, description, price, stock, category_id, sku, brand, isActive } = req.body;
        
        // Check role
        const [userResult] = await conn.execute('SELECT role FROM users WHERE id = ?', [userId]);
        const isAdmin = userResult.length > 0 && userResult[0].role === 'admin';

        // Check ownership or admin
        let checkQuery = 'SELECT id FROM products WHERE id = ?';
        let checkParams = [id];
        
        if (!isAdmin) {
            checkQuery += ' AND seller_id = ?';
            checkParams.push(userId);
        }

        const [check] = await conn.execute(checkQuery, checkParams);
        if (check.length === 0) {
            return res.status(403).json({ error: 'Unauthorized or product not found' });
        }

        let query = 'UPDATE products SET updated_at = NOW()';
        let params = [];

        if (name !== undefined) { query += ', name = ?'; params.push(name); }
        if (description !== undefined) { query += ', description = ?'; params.push(description); }
        if (price !== undefined) { query += ', price = ?'; params.push(price); }
        if (stock !== undefined) { query += ', stock = ?'; params.push(stock); }
        if (category_id !== undefined) { query += ', category_id = ?'; params.push(category_id); }
        if (sku !== undefined) { query += ', sku = ?'; params.push(sku); }
        if (brand !== undefined) { query += ', brand = ?'; params.push(brand); }
        if (isActive !== undefined) { query += ', is_active = ?'; params.push(isActive ? 1 : 0); }

        if (req.file) {
            const imageUrl = `/uploads/products/${req.file.filename}`;
            query += ', image_url = ?';
            params.push(imageUrl);
        }
        
        query += ' WHERE id = ?';
        params.push(id);

        await conn.execute(query, params);
        res.json({ success: true, message: 'Product updated successfully' });

    } catch (error) {
        console.error('[Product API] Update Error:', error);
        res.status(500).json({ error: 'Failed to update product' });
    } finally {
        conn.release();
    }
});

// DELETE /api/products/:id - Delete Product (Seller/Admin)
app.delete('/api/products/:id', authenticate, async (req, res) => {
    const conn = await db.getConnection();
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Check role
        const [userResult] = await conn.execute('SELECT role FROM users WHERE id = ?', [userId]);
        const isAdmin = userResult.length > 0 && userResult[0].role === 'admin';

        let query = 'DELETE FROM products WHERE id = ?';
        let params = [id];

        if (!isAdmin) {
            query += ' AND seller_id = ?';
            params.push(userId);
        }

        const [result] = await conn.execute(query, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('[Product API] Delete Error:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    } finally {
        conn.release();
    }
});

/**
 * 1. BUYER CHECKOUT
 * Creates order from USER'S CART.
 */
app.post('/api/orders', authenticate, async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const buyer_id = req.user.id;
        const { delivery_method, delivery_address, pickup_location } = req.body;

        // 1. Get User's Cart
        const [cartResult] = await conn.execute('SELECT id FROM cart WHERE user_id = ?', [buyer_id]);
        
        if (cartResult.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        
        const cartId = cartResult[0].id;

        // 2. Get Cart Items with Product Details (Price might have changed, but usually we take current price or cart price. Schema has price_at_add)
        const [cartItems] = await conn.execute(`
            SELECT ci.*, p.price as current_price 
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ?
        `, [cartId]);

        if (cartItems.length === 0) {
             return res.status(400).json({ error: 'Cart is empty' });
        }

        // 3. Calculate Total
        let total = 0;
        cartItems.forEach(item => {
            total += Number(item.subtotal);
        });

        // 4. Create Order
        const [orderResult] = await conn.execute(
            `INSERT INTO orders (buyer_id, status, total, delivery_method, delivery_address, pickup_location, cart_id, created_at, updated_at) 
             VALUES (?, 'pending', ?, ?, ?, ?, ?, NOW(), NOW())`,
            [buyer_id, total, delivery_method, delivery_address || null, pickup_location || null, cartId]
        );

        const orderId = orderResult.insertId;

        // 5. Create Order Items from Cart Items
        const now = new Date();
        const week = Math.ceil(now.getDate() / 7); 
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        for (const item of cartItems) {
            await conn.execute(
                `INSERT INTO order_items (order_id, product_id, variant_id, qty, price_at_purchase, subtotal, order_date, order_week, order_month, order_year, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, NOW(), NOW())`,
                [orderId, item.product_id, item.variant_id, item.qty, item.price_at_add, item.subtotal, week, month, year]
            );
        }

        // 6. Clear Cart Items (Optional: or delete cart)
        await conn.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

        await conn.commit();
        console.log(`[Order Service] Order #${orderId} created for Buyer ${buyer_id}`);
        res.status(201).json({ success: true, message: 'Order placed successfully', orderId });

    } catch (error) {
        await conn.rollback();
        console.error('[Order Service] Checkout Error:', error);
        res.status(500).json({ error: 'Failed to place order' });
    } finally {
        conn.release();
    }
});

/**
 * 2. GET ORDERS (Dashboard Synchronization)
 */
app.get('/api/orders', authenticate, async (req, res) => {
    try {
        const userId = req.user.id; 
        const requestedRole = req.query.role; // 'admin', 'seller', 'buyer'

        const [userResult] = await db.execute('SELECT role FROM users WHERE id = ?', [userId]);
        if (userResult.length === 0) return res.status(401).json({error: 'User not found'});
        
        const userRole = userResult[0].role; // 'admin', 'seller', 'buyer'

        let sql = '';
        let params = [];

        const baseQuery = `
            SELECT 
                o.id, o.status, o.total, o.created_at, o.delivery_method,
                u.name as buyer_name, u.email as buyer_email
            FROM orders o
            JOIN users u ON o.buyer_id = u.id
        `;

        // 1. Admin Dashboard View (Explicit Request)
        if (userRole === 'admin' && requestedRole === 'admin') {
            sql = `${baseQuery} ORDER BY o.created_at DESC`;
        } 
        // 2. Seller Dashboard View
        else if (userRole === 'seller' && requestedRole === 'seller') {
            sql = `
                SELECT DISTINCT
                    o.id, o.status, o.total, o.created_at, o.delivery_method,
                    u.name as buyer_name, u.email as buyer_email
                FROM orders o
                JOIN users u ON o.buyer_id = u.id
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE p.seller_id = ?
                ORDER BY o.created_at DESC
            `;
            params = [userId];
        } 
        // 3. Buyer View (Default for everyone)
        else {
            sql = `${baseQuery} WHERE o.buyer_id = ? ORDER BY o.created_at DESC`;
            params = [userId];
        }

        const [orders] = await db.execute(sql, params);

        // Fetch items for these orders
        if (orders.length > 0) {
            const orderIds = orders.map(o => o.id);
            const placeholders = orderIds.map(() => '?').join(',');
            
            const [items] = await db.execute(`
                SELECT 
                    oi.*, 
                    p.name as product_name, 
                    p.sku, 
                    pv.value as variant_name
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                LEFT JOIN product_variants pv ON oi.variant_id = pv.id
                WHERE oi.order_id IN (${placeholders})
            `, orderIds);

            // Group items by order_id
            const itemsByOrder = {};
            items.forEach(item => {
                if (!itemsByOrder[item.order_id]) {
                    itemsByOrder[item.order_id] = [];
                }
                const itemObj = {
                    ...item,
                    product: {
                        name: item.product_name,
                        sku: item.sku
                    },
                    variant: item.variant_name ? { value: item.variant_name } : null
                };
                
                itemsByOrder[item.order_id].push(itemObj);
            });

            // Attach items to orders
            orders.forEach(order => {
                order.items = itemsByOrder[order.id] || [];
            });
        }
        
        // Wrap in the structure expected by frontend: { success: true, data: { data: [...] } }
        res.json({ success: true, data: { data: orders } });
        
    } catch (error) {
        console.error('[Order Service] Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

/**
 * 3. UPDATE ORDER STATUS
 * Used by Seller or Admin to update the status.
 * Payload: { status }
 */
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 

        if (!['pending', 'paid', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        await db.execute(
            'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, id]
        );

        console.log(`[Order Service] Order #${id} status updated to ${status}`);
        res.json({ success: true, message: 'Order status updated' });

    } catch (error) {
        console.error('[Order Service] Update Status Error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

/**
 * 4. GET SINGLE ORDER DETAILS
 */
app.get('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get Order Info
        const [orders] = await db.execute(`
            SELECT o.*, u.name as buyer_name, u.email as buyer_email, u.contact_no as buyer_contact
            FROM orders o
            JOIN users u ON o.buyer_id = u.id
            WHERE o.id = ?
        `, [id]);

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orders[0];

        // Get Order Items
        const [items] = await db.execute(`
            SELECT oi.*, p.name as product_name, p.sku, pv.value as variant_name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            LEFT JOIN product_variants pv ON oi.variant_id = pv.id
            WHERE oi.order_id = ?
        `, [id]);

        order.items = items;

        res.json({ success: true, data: order });

    } catch (error) {
        console.error('[Order Service] Get Detail Error:', error);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
});

/**
 * 5. REVIEWS
 */

// POST /api/reviews - Submit a review
app.post('/api/reviews', authenticate, async (req, res) => {
    const conn = await db.getConnection();
    try {
        const userId = req.user.id;
        const { product_id, rating, comment } = req.body;

        if (!product_id || !rating) {
            return res.status(400).json({ error: 'Product ID and rating are required' });
        }

        // 1. Verify Verified Purchase (STRICTLY 'delivered')
        const [orders] = await conn.execute(`
            SELECT o.id, o.status
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.buyer_id = ? 
            AND oi.product_id = ? 
            AND o.status = 'delivered'
            LIMIT 1
        `, [userId, product_id]);

        if (orders.length === 0) {
            // Check if there are other orders that are NOT delivered to give better error?
            // For now, standard error.
            return res.status(403).json({ error: 'You can only review products after the order is delivered.' });
        }

        // 2. Check if already reviewed
        const [existing] = await conn.execute('SELECT id FROM reviews WHERE user_id = ? AND product_id = ?', [userId, product_id]);
        if (existing.length > 0) {
             return res.status(400).json({ error: 'You have already reviewed this product.' });
        }

        // 3. Insert Review
        await conn.execute(
            'INSERT INTO reviews (user_id, product_id, rating, comment, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [userId, product_id, rating, comment || null]
        );

        res.status(201).json({ success: true, message: 'Review submitted successfully' });

    } catch (error) {
        console.error('[Order Service] Review Error:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    } finally {
        conn.release();
    }
});

// GET /api/reviews?product_id=... - Fetch reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const { product_id } = req.query;
        if (!product_id) return res.status(400).json({ error: 'Product ID required' });

        const [reviews] = await db.execute(`
            SELECT r.*, u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `, [product_id]);

        const mappedReviews = reviews.map(r => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            user: {
                name: r.user_name
            }
        }));

        res.json({ success: true, data: mappedReviews });

    } catch (error) {
        console.error('[Order Service] Fetch Review Error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});        

app.listen(PORT, () => {
    console.log(`Node.js Order Service running on http://localhost:${PORT}`);
});