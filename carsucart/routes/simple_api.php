<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SimpleApiController;

/*
|--------------------------------------------------------------------------
| Simple API Routes
|--------------------------------------------------------------------------
|
| These are basic API routes that don't require complex authentication
| for testing purposes.
|
*/

// Health check
Route::get('/health', [SimpleApiController::class, 'healthCheck']);

// Public product routes
Route::get('/products', [SimpleApiController::class, 'getProducts']);
Route::get('/products/{id}', [SimpleApiController::class, 'getProduct']);

// Public category routes
Route::get('/categories', [SimpleApiController::class, 'getCategories']);
Route::get('/categories/{id}', [SimpleApiController::class, 'getCategory']);

// User management routes
Route::post('/users', [SimpleApiController::class, 'createUser']);
Route::get('/users', [SimpleApiController::class, 'getUsers']);
