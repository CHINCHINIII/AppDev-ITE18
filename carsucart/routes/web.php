<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ProductController;
use App\Http\Controllers\Web\CategoryController;
use App\Http\Controllers\Web\CartController;
use App\Http\Controllers\Web\OrderController;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Test route
Route::get('/test', function () {
    return 'Simple test - no JSON, no views';
});

// Public routes
// Redirect to React frontend (development)
Route::get('/', function () {
    return redirect('http://localhost:3000');
})->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{id}', [CategoryController::class, 'show'])->name('categories.show');

// Authentication routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected routes
Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Cart routes
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'addItem'])->name('cart.add');
    Route::put('/cart/update/{id}', [CartController::class, 'updateItem'])->name('cart.update');
    Route::delete('/cart/remove/{id}', [CartController::class, 'removeItem'])->name('cart.remove');
    Route::delete('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    
    // Order routes
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');
    
    // Seller routes
    Route::middleware('role:seller')->group(function () {
        Route::get('/seller/products', [ProductController::class, 'myProducts'])->name('seller.products');
        Route::get('/seller/products/create', [ProductController::class, 'create'])->name('seller.products.create');
        Route::post('/seller/products', [ProductController::class, 'store'])->name('seller.products.store');
        Route::get('/seller/products/{id}/edit', [ProductController::class, 'edit'])->name('seller.products.edit');
        Route::put('/seller/products/{id}', [ProductController::class, 'update'])->name('seller.products.update');
        Route::delete('/seller/products/{id}', [ProductController::class, 'destroy'])->name('seller.products.destroy');
    });
    
    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/categories', [CategoryController::class, 'adminIndex'])->name('admin.categories');
        Route::get('/admin/categories/create', [CategoryController::class, 'create'])->name('admin.categories.create');
        Route::post('/admin/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
        Route::get('/admin/categories/{id}/edit', [CategoryController::class, 'edit'])->name('admin.categories.edit');
        Route::put('/admin/categories/{id}', [CategoryController::class, 'update'])->name('admin.categories.update');
        Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');
        Route::get('/admin/orders', [OrderController::class, 'adminIndex'])->name('admin.orders');
        Route::get('/admin/users', [DashboardController::class, 'users'])->name('admin.users');
    });
});
