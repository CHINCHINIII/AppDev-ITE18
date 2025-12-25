@extends('web.layouts.app')

@section('title', 'Products - CarSUcart')
@section('description', 'Browse all products on CarSUcart')

@section('content')
<div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Page Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-[#333] mb-2">All Products</h1>
            <p class="text-gray-600">Discover amazing products from fellow students</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Filters Sidebar -->
            <aside class="lg:w-64 flex-shrink-0">
                <div class="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
                    <h2 class="text-lg font-semibold text-[#333] mb-4">Filters</h2>
                    
                    <!-- Categories -->
                    <div class="mb-6">
                        <h3 class="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                        <div class="space-y-2">
                            @php
                                $categories = ['All', 'Electronics', 'Books', 'Clothing', 'Food', 'Supplies', 'Services'];
                            @endphp
                            @foreach($categories as $category)
                                <label class="flex items-center">
                                    <input type="checkbox" class="rounded border-gray-300 text-[#00D084] focus:ring-[#00D084]">
                                    <span class="ml-2 text-sm text-gray-700">{{ $category }}</span>
                                </label>
                            @endforeach
                        </div>
                    </div>

                    <!-- Price Range -->
                    <div class="mb-6">
                        <h3 class="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">Min: ₱0</label>
                                <input type="range" min="0" max="50000" value="0" class="w-full">
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">Max: ₱50,000</label>
                                <input type="range" min="0" max="50000" value="50000" class="w-full">
                            </div>
                        </div>
                    </div>

                    <!-- Rating -->
                    <div>
                        <h3 class="text-sm font-medium text-gray-700 mb-3">Rating</h3>
                        <div class="space-y-2">
                            @for($i = 5; $i >= 1; $i--)
                                <label class="flex items-center">
                                    <input type="checkbox" class="rounded border-gray-300 text-[#00D084] focus:ring-[#00D084]">
                                    <div class="ml-2 flex items-center">
                                        @for($j = 0; $j < $i; $j++)
                                            <svg class="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                            </svg>
                                        @endfor
                                        <span class="ml-1 text-sm text-gray-700">& Up</span>
                                    </div>
                                </label>
                            @endfor
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Products Grid -->
            <main class="flex-1">
                <!-- Sort and View Options -->
                <div class="flex items-center justify-between mb-6">
                    <p class="text-sm text-gray-600">Showing <span class="font-medium">1-12</span> of <span class="font-medium">48</span> products</p>
                    <select class="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D084]">
                        <option>Sort by: Featured</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Rating: Highest</option>
                        <option>Newest</option>
                    </select>
                </div>

                <!-- Products Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    @php
                        $products = [
                            ['id' => 1, 'name' => 'iPhone 13 Pro', 'price' => 45000, 'image' => 'https://via.placeholder.com/500', 'category' => 'Electronics', 'rating' => 4.8, 'reviews' => 124, 'stock' => 5],
                            ['id' => 2, 'name' => 'Engineering Textbook Set', 'price' => 1299, 'image' => 'https://via.placeholder.com/500', 'category' => 'Books', 'rating' => 4.5, 'reviews' => 67, 'stock' => 3],
                            ['id' => 3, 'name' => 'CarSU Hoodie - Official', 'price' => 599, 'image' => 'https://via.placeholder.com/500', 'category' => 'Clothing', 'rating' => 4.9, 'reviews' => 203, 'stock' => 15],
                            ['id' => 4, 'name' => 'Student Meal Package', 'price' => 150, 'image' => 'https://via.placeholder.com/500', 'category' => 'Food', 'rating' => 4.7, 'reviews' => 89, 'stock' => 20],
                            ['id' => 5, 'name' => 'Laptop Stand', 'price' => 899, 'image' => 'https://via.placeholder.com/500', 'category' => 'Electronics', 'rating' => 4.6, 'reviews' => 45, 'stock' => 8],
                            ['id' => 6, 'name' => 'Notebook Set', 'price' => 199, 'image' => 'https://via.placeholder.com/500', 'category' => 'Supplies', 'rating' => 4.4, 'reviews' => 112, 'stock' => 30],
                        ];
                    @endphp
                    @foreach($products as $product)
                        <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                            <a href="{{ route('products.show', $product['id']) }}">
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
                            </a>

                            <div class="p-4">
                                <div class="text-xs text-gray-500 mb-1">{{ $product['category'] }}</div>
                                <h3 class="text-[#333] mb-2 line-clamp-2 leading-snug font-medium">
                                    <a href="{{ route('products.show', $product['id']) }}" class="hover:text-[#00D084] transition-colors">{{ $product['name'] }}</a>
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

                <!-- Pagination -->
                <div class="mt-8 flex justify-center">
                    <nav class="flex gap-2">
                        <button class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button class="px-4 py-2 bg-[#00D084] text-white rounded-lg text-sm font-medium">1</button>
                        <button class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">2</button>
                        <button class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">3</button>
                        <button class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Next</button>
                    </nav>
                </div>
            </main>
        </div>
    </div>
</div>
@endsection
