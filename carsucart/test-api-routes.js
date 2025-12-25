/**
 * API Routes Test Script
 * Run this with: node test-api-routes.js
 * 
 * Tests all API endpoints to ensure they're working
 */

const BASE_URL = 'http://localhost:8000/api';

const routes = [
  // Public routes
  { method: 'GET', path: '/health', public: true, description: 'Health check' },
  { method: 'GET', path: '/products', public: true, description: 'Get all products' },
  { method: 'GET', path: '/categories', public: true, description: 'Get all categories' },
  { method: 'GET', path: '/products/1', public: true, description: 'Get single product' },
  { method: 'GET', path: '/categories/1', public: true, description: 'Get single category' },
  
  // Auth routes (POST, will test structure)
  { method: 'POST', path: '/login', public: true, description: 'Login endpoint (structure check)' },
  { method: 'POST', path: '/register', public: true, description: 'Register endpoint (structure check)' },
];

async function testRoute(route) {
  try {
    const url = `${BASE_URL}${route.path}`;
    const options = {
      method: route.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    // For POST requests, add minimal data
    if (route.method === 'POST') {
      options.body = JSON.stringify({});
    }

    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    
    return {
      route: route.path,
      method: route.method,
      status: response.status,
      statusText: response.statusText,
      success: response.ok,
      hasData: !!data,
      description: route.description,
    };
  } catch (error) {
    return {
      route: route.path,
      method: route.method,
      status: 'ERROR',
      error: error.message,
      success: false,
      description: route.description,
    };
  }
}

async function testAllRoutes() {
  console.log('🧪 Testing API Routes...\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  console.log('─'.repeat(80));
  
  const results = [];
  
  for (const route of routes) {
    const result = await testRoute(route);
    results.push(result);
    
    const statusIcon = result.success ? '✅' : result.status === 'ERROR' ? '❌' : '⚠️';
    console.log(`${statusIcon} ${result.method.padEnd(6)} ${result.route.padEnd(40)} ${String(result.status).padEnd(10)} ${result.description}`);
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('─'.repeat(80));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n📊 Results: ${successful} passed, ${failed} failed out of ${results.length} routes`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Routes:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   ${r.method} ${r.route} - ${r.status} ${r.error || ''}`);
    });
  }
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or a fetch polyfill');
  console.log('💡 Alternative: Use curl or Postman to test endpoints');
  console.log('\nExample commands:');
  console.log(`  curl ${BASE_URL}/health`);
  console.log(`  curl ${BASE_URL}/products`);
  console.log(`  curl ${BASE_URL}/categories`);
} else {
  testAllRoutes().catch(console.error);
}
