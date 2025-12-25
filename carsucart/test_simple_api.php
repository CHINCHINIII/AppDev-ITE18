<?php
/**
 * Simple API Test Script for CarsuCart
 * This tests the basic API endpoints without complex authentication
 */

$baseUrl = 'http://localhost:8000/api';

// Helper function to make API requests
function makeRequest($url, $method = 'GET', $data = null) {
    $ch = curl_init();
    
    $headers = ['Content-Type: application/json'];
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true)
    ];
}

echo "=== CarsuCart Simple API Test ===\n\n";

// Test 1: Health check
echo "1. Testing Health Check...\n";
$response = makeRequest($baseUrl . '/health');
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";

if ($response['code'] === 200) {
    echo "✅ API is working!\n\n";
    
    // Test 2: Get categories
    echo "2. Testing Get Categories...\n";
    $response = makeRequest($baseUrl . '/categories');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 3: Get products
    echo "3. Testing Get Products...\n";
    $response = makeRequest($baseUrl . '/products');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 4: Create a user
    echo "4. Testing Create User...\n";
    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'role' => 'buyer'
    ];
    $response = makeRequest($baseUrl . '/users', 'POST', $userData);
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 5: Get users
    echo "5. Testing Get Users...\n";
    $response = makeRequest($baseUrl . '/users');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
} else {
    echo "❌ API is not responding. Make sure the server is running.\n";
    echo "Run: php artisan serve\n";
}

echo "=== Test Complete ===\n";
echo "API Base URL: $baseUrl\n";
echo "Available endpoints:\n";
echo "- GET /api/health - Health check\n";
echo "- GET /api/products - Get all products\n";
echo "- GET /api/products/{id} - Get single product\n";
echo "- GET /api/categories - Get all categories\n";
echo "- GET /api/categories/{id} - Get single category\n";
echo "- POST /api/users - Create user\n";
echo "- GET /api/users - Get all users\n";
?>
