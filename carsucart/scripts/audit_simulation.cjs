const axios = require('axios');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const API_URL = 'http://localhost:3001/api';
const DB_CONFIG = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'carsucart'
};

// Utils
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const generateToken = async (conn, userId, userType) => {
    const plainToken = 'test-token-' + Date.now();
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    const [res] = await conn.execute(
        'INSERT INTO personal_access_tokens (tokenable_type, tokenable_id, name, token, abilities, created_at, updated_at) VALUES (?, ?, "Test Token", ?, "[\"*\"]", NOW(), NOW())',
        [userType === 'admin' ? 'App\Models\Admin' : 'App\Models\User', userId, hashedToken]
    );
    return `${res.insertId}|${plainToken}`;
};

async function runAudit() {
    console.log('--- STARTING SYSTEM AUDIT ---');
    const conn = await mysql.createConnection(DB_CONFIG);
    
    try {
        // 1. DATA SETUP
        console.log('\n[SETUP] Preparing Test Data...');
        
        // Ensure Users Exist
        // Buyer
        let [buyers] = await conn.execute('SELECT * FROM users WHERE role = "buyer" LIMIT 1');
        let buyerId;
        if (buyers.length === 0) {
            const [res] = await conn.execute('INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES ("Test Buyer", "buyer@test.com", "password", "buyer", NOW(), NOW())');
            buyerId = res.insertId;
        } else {
            buyerId = buyers[0].id;
        }
        
        // Seller
        let [sellers] = await conn.execute('SELECT * FROM users WHERE role = "seller" LIMIT 1');
        let sellerId;
        if (sellers.length === 0) {
            const [res] = await conn.execute('INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES ("Test Seller", "seller@test.com", "password", "seller", NOW(), NOW())');
            sellerId = res.insertId;
        } else {
            sellerId = sellers[0].id;
        }

        // Admin (User table admin or Admin model? server.js checks users table role)
        let [admins] = await conn.execute('SELECT * FROM users WHERE role = "admin" LIMIT 1');
        let adminId;
        if (admins.length === 0) {
            const [res] = await conn.execute('INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES ("Test Admin", "admin@test.com", "password", "admin", NOW(), NOW())');
            adminId = res.insertId;
        } else {
            adminId = admins[0].id;
        }

        // Product (linked to Seller)
        let [products] = await conn.execute('SELECT * FROM products WHERE seller_id = ? LIMIT 1', [sellerId]);
        let productId;
        if (products.length === 0) {
            const [res] = await conn.execute('INSERT INTO products (name, seller_id, price, stock, description, created_at, updated_at) VALUES ("Test Product", ?, 100.00, 50, "Desc", NOW(), NOW())', [sellerId]);
            productId = res.insertId;
        } else {
            productId = products[0].id;
        }

        console.log(`[SETUP] Buyer: ${buyerId}, Seller: ${sellerId}, Admin: ${adminId}, Product: ${productId}`);

        // CLEANUP
        await conn.execute('DELETE FROM reviews');
        await conn.execute('DELETE FROM order_items');
        await conn.execute('DELETE FROM orders');
        await conn.execute('DELETE FROM cart_items');
        await conn.execute('DELETE FROM cart');

        // Generate Tokens
        const buyerToken = await generateToken(conn, buyerId, 'user');
        const sellerToken = await generateToken(conn, sellerId, 'user');
        const adminToken = await generateToken(conn, adminId, 'user');

        // ---------------------------------------------------------
        // 1. BUYER FLOW
        // ---------------------------------------------------------
        console.log('\n--- 1. BUYER FLOW ---');
        
        // 1.1 Add to Cart (Simulate Frontend)
        console.log('[Buyer] Adding item to cart...');
        await conn.execute('DELETE FROM cart WHERE user_id = ?', [buyerId]);
        const [cartRes] = await conn.execute('INSERT INTO cart (user_id, created_at, updated_at) VALUES (?, NOW(), NOW())', [buyerId]);
        const cartId = cartRes.insertId;
        await conn.execute('INSERT INTO cart_items (cart_id, product_id, qty, price_at_add, subtotal, created_at, updated_at) VALUES (?, ?, 1, 100.00, 100.00, NOW(), NOW())', [cartId, productId]);

        // 1.2 Checkout
        console.log('[Buyer] Checking out...');
        const checkoutRes = await axios.post(`${API_URL}/orders`, {
            delivery_method: 'delivery',
            delivery_address: '123 Test St'
        }, { headers: { Authorization: `Bearer ${buyerToken}` } });
        
        const orderId = checkoutRes.data.orderId;
        console.log(`[Buyer] Order Created: #${orderId}`);

        // 1.3 Track Orders
        console.log('[Buyer] Fetching Orders...');
        const ordersRes = await axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${buyerToken}` } });
        const myOrders = ordersRes.data.data.data;
        console.log(`[Buyer] Orders Found: ${myOrders.length}`);
        
        // Verify only my orders
        const otherOrders = myOrders.filter(o => o.buyer_email !== 'buyer@test.com' && o.buyer_email !== buyers[0]?.email); // simple check
        if (otherOrders.length > 0) {
            console.error('[CRITICAL] Buyer sees other users orders!');
        } else {
            console.log('[PASS] Buyer sees only their orders.');
        }

        // 1.4 Test Admin "My Orders" Bug
        console.log('[Admin-as-Buyer] Testing "Track Orders" count bug...');
        // Admin places an order
        await conn.execute('DELETE FROM cart WHERE user_id = ?', [adminId]);
        const [admCart] = await conn.execute('INSERT INTO cart (user_id, created_at, updated_at) VALUES (?, NOW(), NOW())', [adminId]);
        await conn.execute('INSERT INTO cart_items (cart_id, product_id, qty, price_at_add, subtotal, created_at, updated_at) VALUES (?, ?, 1, 100.00, 100.00, NOW(), NOW())', [admCart.insertId, productId]);
        
        await axios.post(`${API_URL}/orders`, { delivery_method: 'pickup' }, { headers: { Authorization: `Bearer ${adminToken}` } });
        
        // Admin fetches orders
        const adminOrdersRes = await axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${adminToken}` } });
        const allOrdersCount = adminOrdersRes.data.data.data.length;
        console.log(`[Admin] Fetching Orders returned ${allOrdersCount} items.`);
        
        // If Admin sees MORE than their 1 order (and we know there is at least the buyer's order), the bug exists
        // (Assuming "Track Orders" page calls this endpoint)
        if (allOrdersCount > 1) { // We just made 1 for buyer, 1 for admin. Admin should see 2.
            // But if Admin wants "My Orders", they should see 1.
            // The prompt implies the "Track Orders" feature (personal) is showing global count.
            console.log('[BUG REPRODUCED] Admin sees ALL orders in default fetch, interfering with "My Orders" view.');
        }

        // 1.5 Try Review (Should Fail)
        console.log('[Buyer] Attempting Review on Pending Order...');
        try {
            await axios.post(`${API_URL}/reviews`, {
                product_id: productId,
                rating: 5,
                comment: 'Premature review'
            }, { headers: { Authorization: `Bearer ${buyerToken}` } });
            console.error('[FAIL] Review should have been rejected!');
        } catch (e) {
            if (e.response && (e.response.status === 403 || e.response.status === 400)) {
                console.log(`[PASS] Review rejected as expected: ${e.response.data.error}`);
            } else {
                console.error('[FAIL] Unexpected error:', e.message);
            }
        }

        // ---------------------------------------------------------
        // 2. SELLER FLOW
        // ---------------------------------------------------------
        console.log('\n--- 2. SELLER FLOW ---');
        
        // 2.1 Fetch Orders
        console.log('[Seller] Fetching Orders...');
        const sellerOrdersRes = await axios.get(`${API_URL}/orders?role=seller`, { headers: { Authorization: `Bearer ${sellerToken}` } });
        const sellerOrders = sellerOrdersRes.data.data.data;
        const targetOrder = sellerOrders.find(o => o.id === orderId);
        
        if (targetOrder) {
            console.log(`[PASS] Seller sees Buyer Order #${orderId}`);
        } else {
            console.error(`[FAIL] Seller CANNOT see Order #${orderId}`);
        }

        // 2.2 Update Status
        console.log('[Seller] Updating Status to "delivered"...');
        await axios.put(`${API_URL}/orders/${orderId}/status`, { status: 'delivered' }, { headers: { Authorization: `Bearer ${sellerToken}` } });
        console.log('[PASS] Status updated.');

        // ---------------------------------------------------------
        // 3. BUYER FLOW (RETRY REVIEW)
        // ---------------------------------------------------------
        console.log('\n--- 3. BUYER FLOW (RETRY REVIEW) ---');
        try {
            await axios.post(`${API_URL}/reviews`, {
                product_id: productId,
                rating: 5,
                comment: 'Great product!'
            }, { headers: { Authorization: `Bearer ${buyerToken}` } });
            console.log('[PASS] Review submitted successfully after delivery.');
        } catch (e) {
            console.error(`[FAIL] Review failed even after delivery: ${e.response?.data?.error || e.message}`);
        }

        // ---------------------------------------------------------
        // 4. ADMIN FLOW
        // ---------------------------------------------------------
        console.log('\n--- 4. ADMIN FLOW ---');
        const finalAdminRes = await axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${adminToken}` } });
        const finalCount = finalAdminRes.data.data.data.length;
        console.log(`[Admin] Sees ${finalCount} total orders.`);

    } catch (error) {
        console.error('AUDIT FATAL ERROR:', error.message);
        if (error.response) console.error('Response Data:', error.response.data);
    } finally {
        await conn.end();
        console.log('--- AUDIT COMPLETE ---');
    }
}

runAudit();
