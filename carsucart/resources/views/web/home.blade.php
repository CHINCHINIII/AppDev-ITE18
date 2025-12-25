@extends('web.layouts.app')

@section('title', 'CarSUcart - Campus Marketplace')
@section('description', 'Your one-stop marketplace for everything you need at Caraga State University')

@section('content')
<!-- Hero Section -->
<section class="px-6 pt-8 pb-12">
    <div class="max-w-7xl mx-auto">
        <div class="bg-gradient-to-br from-[#00D084] to-[#00966A] rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden">
            <!-- Floating background elements -->
            <div class="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            
            <div class="relative z-10">
                <h1 class="text-3xl md:text-4xl lg:text-5xl mb-4 font-bold">
                    Welcome to CarSUcart
                </h1>
                <p class="text-white/90 text-base md:text-lg mb-8 max-w-2xl">
                    Your one-stop marketplace for everything you need at Caraga State University
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                    <a href="{{ route('products.index') }}" class="bg-white text-[#00D084] hover:bg-gray-100 hover:scale-105 transition-all duration-300 h-12 px-8 rounded-lg shadow-sm font-medium inline-flex items-center justify-center">
                        Start Shopping
                    </a>
                    <a href="{{ route('seller.register') }}" class="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 h-12 px-8 rounded-lg font-medium inline-flex items-center justify-center">
                        Become a Seller
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Categories Section -->
<section class="px-6 py-12">
    <div class="max-w-7xl mx-auto">
        <div class="mb-8">
            <h2 class="text-[#333] text-2xl font-semibold mb-2">Browse Categories</h2>
            <p class="text-gray-600">Find what you need faster</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            @php
                $categories = [
                    ['id' => 1, 'name' => 'Electronics', 'icon' => '📱', 'color' => 'bg-blue-50'],
                    ['id' => 2, 'name' => 'Books', 'icon' => '📚', 'color' => 'bg-yellow-50'],
                    ['id' => 3, 'name' => 'Clothing', 'icon' => '👕', 'color' => 'bg-purple-50'],
                    ['id' => 4, 'name' => 'Food', 'icon' => '🍔', 'color' => 'bg-orange-50'],
                    ['id' => 5, 'name' => 'Supplies', 'icon' => '✏️', 'color' => 'bg-green-50'],
                    ['id' => 6, 'name' => 'Services', 'icon' => '🛠️', 'color' => 'bg-red-50'],
                ];
            @endphp
            @foreach($categories as $category)
                <a href="{{ route('categories.show', $category['id']) }}" class="{{ $category['color'] }} p-6 rounded-2xl text-center hover:shadow-md transition-shadow block">
                    <div class="text-4xl mb-3">{{ $category['icon'] }}</div>
                    <div class="text-[#333] text-sm font-medium">{{ $category['name'] }}</div>
                </a>
            @endforeach
        </div>
    </div>
</section>

<!-- Featured Products -->
<section class="px-6 py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-[#333] text-2xl font-semibold mb-2">Featured Products</h2>
                <p class="text-gray-600">Handpicked items just for you</p>
            </div>
            <a href="{{ route('products.index') }}" class="border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2 font-medium transition-colors">
                View All
            </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @php
                $products = [
                    ['id' => 1, 'name' => 'iPhone 13 Pro', 'price' => 45000, 'image' => 'https://via.placeholder.com/500', 'category' => 'Electronics', 'rating' => 4.8, 'reviews' => 124, 'stock' => 5],
                    ['id' => 2, 'name' => 'Engineering Textbook Set', 'price' => 1299, 'image' => 'https://via.placeholder.com/500', 'category' => 'Books', 'rating' => 4.5, 'reviews' => 67, 'stock' => 3],
                    ['id' => 3, 'name' => 'CarSU Hoodie - Official', 'price' => 599, 'image' => 'https://via.placeholder.com/500', 'category' => 'Clothing', 'rating' => 4.9, 'reviews' => 203, 'stock' => 15],
                    ['id' => 4, 'name' => 'Student Meal Package', 'price' => 150, 'image' => 'https://via.placeholder.com/500', 'category' => 'Food', 'rating' => 4.7, 'reviews' => 89, 'stock' => 20],
                ];
            @endphp
            @foreach($products as $product)
                <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                    <!-- Product Image -->
                    <div class="relative aspect-square bg-gray-100 overflow-hidden">
                        <img
                            src="{{ $product['image'] }}"
                            alt="{{ $product['name'] }}"
                            class="w-full h-full object-cover"
                        >
                        <div class="absolute top-3 right-3">
                            <span class="bg-white/95 backdrop-blur-sm text-[#00D084] text-xs px-3 py-1.5 rounded-full shadow-sm">
                                {{ $product['stock'] < 5 ? 'Low Stock' : 'In Stock' }}
                            </span>
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div class="p-4">
                        <div class="text-xs text-gray-500 mb-1">{{ $product['category'] }}</div>
                        <h3 class="text-[#333] mb-2 line-clamp-2 leading-snug font-medium">
                            <a href="{{ route('products.show', $product['id']) }}">{{ $product['name'] }}</a>
                        </h3>
                        
                        <div class="flex items-baseline gap-2 mb-3">
                            <span class="text-[#00D084] text-xl font-semibold">₱{{ number_format($product['price'], 2) }}</span>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-1">
                                <svg class="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                </svg>
                                <span class="text-sm text-gray-700 font-medium">{{ $product['rating'] }}</span>
                                <span class="text-xs text-gray-400">({{ $product['reviews'] }})</span>
                            </div>
                            
                            <form action="{{ route('cart.add') }}" method="POST">
                                @csrf
                                <input type="hidden" name="product_id" value="{{ $product['id'] }}">
                                <input type="hidden" name="quantity" value="1">
                                <button type="submit" class="bg-[#00D084] hover:bg-[#00966A] text-white h-8 px-4 rounded-lg text-sm font-medium transition-colors">
                                    Add
                                </button>
                            </form>
                        </div>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>

<!-- Popular Sellers Section -->
<section class="px-6 py-12">
    <div class="max-w-7xl mx-auto">
        <div class="mb-8">
            <h2 class="text-[#333] text-2xl font-semibold mb-2">Popular Sellers</h2>
            <p class="text-gray-600">Trusted by students</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @php
                $sellers = ['Tech Corner CSU', 'BookHub CSU', 'Campus Store', 'Student Essentials'];
            @endphp
            @foreach($sellers as $seller)
                <div class="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <div class="w-16 h-16 bg-gradient-to-br from-[#00D084] to-[#00966A] rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-semibold">
                        {{ substr($seller, 0, 1) }}
                    </div>
                    <h3 class="text-[#333] text-sm font-medium mb-1">{{ $seller }}</h3>
                    <p class="text-xs text-gray-500">{{ rand(20, 70) }} products</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
@endsection
