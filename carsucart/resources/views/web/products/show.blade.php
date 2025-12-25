@extends('web.layouts.app')

@section('title', 'Product Details - CarSUcart')
@section('description', 'View product details')

@section('content')
<div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Breadcrumbs -->
        <nav class="mb-6" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-2 text-sm text-gray-600">
                <li><a href="{{ route('home') }}" class="hover:text-[#00D084]">Home</a></li>
                <li>/</li>
                <li><a href="{{ route('products.index') }}" class="hover:text-[#00D084]">Products</a></li>
                <li>/</li>
                <li class="text-gray-900 font-medium">Product Details</li>
            </ol>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Product Images -->
            <div>
                <div class="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                    <img 
                        src="https://via.placeholder.com/800" 
                        alt="Product Image" 
                        class="w-full h-full object-cover"
                    >
                </div>
                <div class="grid grid-cols-4 gap-4">
                    @for($i = 0; $i < 4; $i++)
                        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#00D084] transition-colors">
                            <img 
                                src="https://via.placeholder.com/200" 
                                alt="Thumbnail {{ $i + 1 }}" 
                                class="w-full h-full object-cover"
                            >
                        </div>
                    @endfor
                </div>
            </div>

            <!-- Product Info -->
            <div>
                <div class="mb-4">
                    <span class="text-sm text-gray-500">Electronics</span>
                    <h1 class="text-3xl font-bold text-[#333] mt-2 mb-4">iPhone 13 Pro</h1>
                    
                    <div class="flex items-center gap-4 mb-6">
                        <div class="flex items-center gap-1">
                            @for($i = 0; $i < 5; $i++)
                                <svg class="w-5 h-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                </svg>
                            @endfor
                            <span class="ml-2 text-gray-700 font-medium">4.8</span>
                            <span class="text-gray-400">(124 reviews)</span>
                        </div>
                    </div>

                    <div class="mb-6">
                        <span class="text-4xl font-bold text-[#00D084]">₱45,000.00</span>
                        <p class="text-sm text-gray-500 mt-1">In Stock (5 available)</p>
                    </div>
                </div>

                <!-- Variants -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Select Variant</label>
                    <div class="flex gap-2">
                        @foreach(['Space Gray', 'Silver', 'Gold'] as $variant)
                            <button class="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-[#00D084] hover:text-[#00D084] transition-colors">
                                {{ $variant }}
                            </button>
                        @endforeach
                    </div>
                </div>

                <!-- Quantity -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center border border-gray-200 rounded-lg">
                            <button class="px-4 py-2 hover:bg-gray-100">-</button>
                            <input type="number" value="1" min="1" max="5" class="w-16 text-center border-0 focus:outline-none">
                            <button class="px-4 py-2 hover:bg-gray-100">+</button>
                        </div>
                        <span class="text-sm text-gray-600">5 available</span>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4 mb-8">
                    <form action="{{ route('cart.add') }}" method="POST" class="flex-1">
                        @csrf
                        <input type="hidden" name="product_id" value="1">
                        <input type="hidden" name="quantity" value="1">
                        <button type="submit" class="w-full bg-[#00D084] hover:bg-[#00966A] text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                            Add to Cart
                        </button>
                    </form>
                    <button class="bg-white border-2 border-[#00D084] text-[#00D084] hover:bg-[#00D084] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                        Buy Now
                    </button>
                </div>

                <!-- Additional Actions -->
                <div class="flex items-center gap-6 text-sm">
                    <button class="flex items-center gap-2 text-gray-600 hover:text-[#00D084] transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                        Add to Wishlist
                    </button>
                    <button class="flex items-center gap-2 text-gray-600 hover:text-[#00D084] transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.885 12.938 9 12.482 9 12c0-.482-.115-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                        </svg>
                        Share
                    </button>
                </div>

                <!-- Seller Info -->
                <div class="mt-8 p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-[#00D084] to-[#00966A] rounded-full flex items-center justify-center text-white font-semibold">
                            T
                        </div>
                        <div>
                            <h3 class="font-semibold text-[#333]">Tech Corner CSU</h3>
                            <p class="text-sm text-gray-600">4.9 rating • 150+ products</p>
                        </div>
                        <button class="ml-auto text-[#00D084] hover:text-[#00966A] font-medium text-sm">
                            View Store
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Product Details Tabs -->
        <div class="mt-12">
            <div class="border-b border-gray-200">
                <nav class="flex gap-8">
                    <button class="pb-4 border-b-2 border-[#00D084] text-[#00D084] font-medium">Description</button>
                    <button class="pb-4 text-gray-600 hover:text-[#00D084] font-medium">Reviews (124)</button>
                    <button class="pb-4 text-gray-600 hover:text-[#00D084] font-medium">Seller Info</button>
                </nav>
            </div>

            <div class="mt-8">
                <div class="prose max-w-none">
                    <p class="text-gray-700 leading-relaxed">
                        Excellent condition iPhone 13 Pro, 256GB storage. Includes original charger and box. 
                        No scratches or dents. Perfect for students looking for a reliable smartphone.
                    </p>
                    <h3 class="text-xl font-semibold text-[#333] mt-6 mb-4">Features</h3>
                    <ul class="list-disc list-inside space-y-2 text-gray-700">
                        <li>256GB Storage</li>
                        <li>Triple Camera System</li>
                        <li>5G Capable</li>
                        <li>Original Accessories Included</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Reviews Section -->
        <div class="mt-12">
            <h2 class="text-2xl font-bold text-[#333] mb-6">Customer Reviews</h2>
            <div class="space-y-6">
                @for($i = 0; $i < 3; $i++)
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <h4 class="font-semibold text-[#333]">John Doe</h4>
                                    <div class="flex items-center gap-1">
                                        @for($j = 0; $j < 5; $j++)
                                            <svg class="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                            </svg>
                                        @endfor
                                    </div>
                                    <span class="text-sm text-gray-500">2 days ago</span>
                                </div>
                                <p class="text-gray-700">Great product! Exactly as described. Fast shipping and excellent condition.</p>
                            </div>
                        </div>
                    </div>
                @endfor
            </div>
        </div>
    </div>
</div>
@endsection
