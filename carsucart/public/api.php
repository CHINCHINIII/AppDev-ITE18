<?php
/**
 * Simple API for CarsuCart
 * This is a basic PHP API that works without complex Laravel dependencies
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
$dbPath = __DIR__ . '/../database/database.sqlite';
$pdo = new PDO("sqlite:$dbPath");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path);

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
    switch ($path) {
        case '/health':
            sendResponse([
                'success' => true,
                'message' => 'API is working!',
                'timestamp' => date('Y-m-d H:i:s'),
                'version' => '1.0.0'
            ]);
            break;
            
        case '/products':
            if ($method === 'GET') {
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
            break;
            
        case (preg_match('/\/products\/(\d+)/', $path, $matches) ? true : false):
            if ($method === 'GET') {
                $productId = $matches[1];
                $stmt = $pdo->prepare("
                    SELECT p.*, c.name as category_name, u.name as seller_name 
                    FROM products p 
                    LEFT JOIN categories c ON p.category_id = c.id 
                    LEFT JOIN users u ON p.seller_id = u.id 
                    WHERE p.id = ? AND p.is_active = 1
                ");
                $stmt->execute([$productId]);
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
            }
            break;
            
        case '/categories':
            if ($method === 'GET') {
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
            break;
            
        case (preg_match('/\/categories\/(\d+)/', $path, $matches) ? true : false):
            if ($method === 'GET') {
                $categoryId = $matches[1];
                $stmt = $pdo->prepare("
                    SELECT c.*, COUNT(p.id) as products_count 
                    FROM categories c 
                    LEFT JOIN products p ON c.id = p.category_id 
                    WHERE c.id = ?
                    GROUP BY c.id
                ");
                $stmt->execute([$categoryId]);
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
            }
            break;
            
        case '/users':
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
                    INSERT INTO users (name, email, password, role, contact_no, store_name, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
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
                'success' => false,
                'message' => 'Endpoint not found'
            ], 404);
    }
} catch (Exception $e) {
    sendResponse([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ], 500);
}
?>
