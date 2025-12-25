<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        // Get featured products (latest 8 products)
        $featuredProducts = Product::with(['category', 'seller'])
            ->where('is_active', true)
            ->latest()
            ->limit(8)
            ->get();

        // Get categories with product counts
        $categories = Category::withCount('products')
            ->having('products_count', '>', 0)
            ->limit(6)
            ->get();

        // Get latest products for "New Arrivals"
        $newArrivals = Product::with(['category', 'seller'])
            ->where('is_active', true)
            ->latest()
            ->limit(4)
            ->get();

        return view('web.home', compact('featuredProducts', 'categories', 'newArrivals'));
    }
}
