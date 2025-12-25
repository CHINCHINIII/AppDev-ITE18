<?php
/**
 * Simple API for CarsuCart
 * This works directly with XAMPP - access via http://localhost/carsucart/api.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple database connection (using SQLite for simplicity)
$dbPath = __DIR__ . '/database/database.sqlite';
if (!file_exists($dbPath)) {
    // Create SQLite database if it doesn't exist
    $pdo = new PDO("sqlite:$dbPath");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create basic tables
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'buyer',
            contact_no VARCHAR(20),
            store_name VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            seller_id INTEGER,
            category_id INTEGER,
            sku VARCHAR(100) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            stock INTEGER DEFAULT 0,
            unit VARCHAR(50),
            brand VARCHAR(100),
            is_active BOOLEAN DEFAULT 1,
            added_week INTEGER,
            added_month INTEGER,
            added_year INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES users(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    ");
    
    // Insert sample data
    $pdo->exec("INSERT OR IGNORE INTO categories (name) VALUES 
        ('Electronics'), ('Clothing'), ('Books'), ('Home & Garden'), ('Sports')");
    
    $pdo->exec("INSERT OR IGNORE INTO users (name, email, password, role, store_name) VALUES 
        ('John Seller', 'john@example.com', '" . password_hash('password123', PASSWORD_DEFAULT) . "', 'seller', 'John Store'),
        ('Jane Buyer', 'jane@example.com', '" . password_hash('password123', PASSWORD_DEFAULT) . "', 'buyer', NULL)");
    
    $pdo->exec("INSERT OR IGNORE INTO products (seller_id, category_id, sku, name, description, price, stock, unit, brand) VALUES 
        (1, 1, 'LAPTOP001', 'Gaming Laptop', 'High-performance gaming laptop', 999.99, 10, 'piece', 'TechBrand'),
        (1, 2, 'SHIRT001', 'Cotton T-Shirt', 'Comfortable cotton t-shirt', 29.99, 50, 'piece', 'FashionBrand'),
        (1, 3, 'BOOK001', 'Programming Guide', 'Complete programming guide', 49.99, 25, 'piece', 'TechBooks')");
}

$pdo = new PDO("sqlite:$dbPath");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Helper function to send JSON response
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_PRETTY_PRINT);
    exit();
}

// Helper function to get request data
function getRequestData() {
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}

// Route handling
try {
    switch ($action) {
        case 'health':
            sendResponse([
                'success' => true,
                'message' => 'API is working!',
                'timestamp' => date('Y-m-d H:i:s'),
                'version' => '1.0.0'
            ]);
            break;
            
        case 'products':
            if ($method === 'GET') {
                $id = $_GET['id'] ?? null;
                if ($id) {
                    // Get single product
                    $stmt = $pdo->prepare("
                        SELECT p.*, c.name as category_name, u.name as seller_name 
                        FROM products p 
                        LEFT JOIN categories c ON p.category_id = c.id 
                        LEFT JOIN users u ON p.seller_id = u.id 
                        WHERE p.id = ? AND p.is_active = 1
                    ");
                    $stmt->execute([$id]);
                    $product = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($product) {
                        sendResponse([
                            'success' => true,
                            'message' => 'Product retrieved successfully',
                            'data' => $product
                        ]);
                    } else {
                        sendResponse([
                            'success' => false,
                            'message' => 'Product not found'
                        ], 404);
                    }
                } else {
                    // Get all products
                    $stmt = $pdo->query("
                        SELECT p.*, c.name as category_name, u.name as seller_name 
                        FROM products p 
                        LEFT JOIN categories c ON p.category_id = c.id 
                        LEFT JOIN users u ON p.seller_id = u.id 
                        WHERE p.is_active = 1
                        ORDER BY p.created_at DESC
                    ");
                    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    sendResponse([
                        'success' => true,
                        'message' => 'Products retrieved successfully',
                        'data' => $products
                    ]);
                }
            }
            break;
            
        case 'categories':
            if ($method === 'GET') {
                $id = $_GET['id'] ?? null;
                if ($id) {
                    // Get single category
                    $stmt = $pdo->prepare("
                        SELECT c.*, COUNT(p.id) as products_count 
                        FROM categories c 
                        LEFT JOIN products p ON c.id = p.category_id 
                        WHERE c.id = ?
                        GROUP BY c.id
                    ");
                    $stmt->execute([$id]);
                    $category = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($category) {
                        sendResponse([
                            'success' => true,
                            'message' => 'Category retrieved successfully',
                            'data' => $category
                        ]);
                    } else {
                        sendResponse([
                            'success' => false,
                            'message' => 'Category not found'
                        ], 404);
                    }
                } else {
                    // Get all categories
                    $stmt = $pdo->query("
                        SELECT c.*, COUNT(p.id) as products_count 
                        FROM categories c 
                        LEFT JOIN products p ON c.id = p.category_id 
                        GROUP BY c.id
                        ORDER BY c.name
                    ");
                    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    sendResponse([
                        'success' => true,
                        'message' => 'Categories retrieved successfully',
                        'data' => $categories
                    ]);
                }
            }
            break;
            
        case 'users':
            if ($method === 'GET') {
                $stmt = $pdo->query("SELECT * FROM users ORDER BY created_at DESC");
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                sendResponse([
                    'success' => true,
                    'message' => 'Users retrieved successfully',
                    'data' => $users
                ]);
            } elseif ($method === 'POST') {
                $data = getRequestData();
                
                // Basic validation
                if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
                    sendResponse([
                        'success' => false,
                        'message' => 'Name, email, and password are required'
                    ], 400);
                }
                
                // Check if email already exists
                $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
                $stmt->execute([$data['email']]);
                if ($stmt->fetch()) {
                    sendResponse([
                        'success' => false,
                        'message' => 'Email already exists'
                    ], 400);
                }
                
                // Insert user
                $stmt = $pdo->prepare("
                    INSERT INTO users (name, email, password, role, contact_no, store_name) 
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $data['name'],
                    $data['email'],
                    password_hash($data['password'], PASSWORD_DEFAULT),
                    $data['role'] ?? 'buyer',
                    $data['contact_no'] ?? null,
                    $data['store_name'] ?? null
                ]);
                
                $userId = $pdo->lastInsertId();
                
                // Get the created user
                $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
                $stmt->execute([$userId]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                sendResponse([
                    'success' => true,
                    'message' => 'User created successfully',
                    'data' => $user
                ], 201);
            }
            break;
            
        default:
            sendResponse([
                'success' => true,
                'message' => 'CarsuCart API is working!',
                'timestamp' => date('Y-m-d H:i:s'),
                'version' => '1.0.0',
                'usage' => 'Add ?action=endpoint to access different endpoints',
                'endpoints' => [
                    'GET ?action=health' => 'Health check',
                    'GET ?action=products' => 'Get all products',
                    'GET ?action=products&id=1' => 'Get single product',
                    'GET ?action=categories' => 'Get all categories',
                    'GET ?action=categories&id=1' => 'Get single category',
                    'POST ?action=users' => 'Create user',
                    'GET ?action=users' => 'Get all users'
                ]
            ]);
    }
} catch (Exception $e) {
    sendResponse([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ], 500);
}
?>
