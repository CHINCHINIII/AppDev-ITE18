<?php
/**
 * Simple XAMPP API Test Script for CarsuCart
 * This tests the API that works with XAMPP using query parameters
 */

$baseUrl = 'http://localhost/carsucart/api.php';

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

echo "=== CarsuCart Simple XAMPP API Test ===\n\n";

// Test 1: API Info
echo "1. Testing API Info...\n";
$response = makeRequest($baseUrl);
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";

if ($response['code'] === 200) {
    echo "✅ API is working!\n\n";
    
    // Test 2: Health check
    echo "2. Testing Health Check...\n";
    $response = makeRequest($baseUrl . '?action=health');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 3: Get categories
    echo "3. Testing Get Categories...\n";
    $response = makeRequest($baseUrl . '?action=categories');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 4: Get products
    echo "4. Testing Get Products...\n";
    $response = makeRequest($baseUrl . '?action=products');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 5: Get single product
    echo "5. Testing Get Single Product...\n";
    $response = makeRequest($baseUrl . '?action=products&id=1');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 6: Create a user
    echo "6. Testing Create User...\n";
    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'role' => 'buyer'
    ];
    $response = makeRequest($baseUrl . '?action=users', 'POST', $userData);
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // Test 7: Get users
    echo "7. Testing Get Users...\n";
    $response = makeRequest($baseUrl . '?action=users');
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['data'], JSON_PRETTY_PRINT) . "\n\n";
    
} else {
    echo "❌ API is not responding. Make sure XAMPP is running.\n";
    echo "1. Start XAMPP (Apache and MySQL)\n";
    echo "2. Access: http://localhost/carsucart/api.php\n";
}

echo "=== Test Complete ===\n";
echo "API Base URL: $baseUrl\n";
echo "Available endpoints:\n";
echo "- GET ?action=health - Health check\n";
echo "- GET ?action=products - Get all products\n";
echo "- GET ?action=products&id=1 - Get single product\n";
echo "- GET ?action=categories - Get all categories\n";
echo "- GET ?action=categories&id=1 - Get single category\n";
echo "- POST ?action=users - Create user\n";
echo "- GET ?action=users - Get all users\n";
?>
