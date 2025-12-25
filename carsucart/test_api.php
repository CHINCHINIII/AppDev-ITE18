<?php
/**
 * Simple API Test Script for CarsuCart
 * Run this script to test the API endpoints
 */

$baseUrl = 'http://localhost:8000/api';

// Helper function to make API requests
function makeRequest($url, $method = 'GET', $data = null, $cookies = null) {
    $ch = curl_init();
    
    $headers = ['Content-Type: application/json'];
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_COOKIEJAR, 'cookies.txt');
    curl_setopt($ch, CURLOPT_COOKIEFILE, 'cookies.txt');
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
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

echo "=== CarsuCart API Test Script ===\n\n";

// Test 1: Register a new user
echo "1. Testing User Registration...\n";
$registerData = [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123',
    'role' => 'buyer'
];

$response = makeRequest($baseUrl . '/register', 'POST', $registerData);
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";

if ($response['code'] === 201 && isset($response['data']['data']['authenticated'])) {
    echo "✅ Registration successful! User authenticated.\n\n";
    
    // Test 2: Get current user
    echo "2. Testing Get Current User...\n";
    $response = makeRequest($baseUrl . '/user', 'GET');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 3: Get categories
    echo "3. Testing Get Categories...\n";
    $response = makeRequest($baseUrl . '/categories');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 4: Get products
    echo "4. Testing Get Products...\n";
    $response = makeRequest($baseUrl . '/products');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 5: Get cart
    echo "5. Testing Get Cart...\n";
    $response = makeRequest($baseUrl . '/cart', 'GET');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 6: Get orders
    echo "6. Testing Get Orders...\n";
    $response = makeRequest($baseUrl . '/orders', 'GET');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 7: Logout
    echo "7. Testing Logout...\n";
    $response = makeRequest($baseUrl . '/logout', 'POST');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
} else {
    echo "❌ Registration failed!\n";
}

echo "=== Test Complete ===\n";
echo "Make sure your Laravel server is running: php artisan serve\n";
echo "API Documentation: API_DOCUMENTATION.md\n";
?>
