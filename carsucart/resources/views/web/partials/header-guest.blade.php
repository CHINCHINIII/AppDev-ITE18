<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <div class="flex items-center gap-2 flex-shrink-0">
                <a href="{{ route('home') }}" class="flex items-center gap-2">
                    <div class="bg-[#00D084] p-2 rounded-lg">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <span class="text-xl font-semibold text-[#333]">CarSUcart</span>
                </a>
            </div>

            <!-- Search Bar (Desktop) -->
            <div class="hidden md:flex flex-1 max-w-2xl mx-8">
                <form action="{{ route('products.index') }}" method="GET" class="w-full">
                    <div class="relative">
                        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input 
                            type="text" 
                            name="search"
                            placeholder="Search products, categories, or sellers..." 
                            value="{{ request('search') }}"
                            class="w-full pl-11 pr-4 h-11 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent"
                        >
                    </div>
                </form>
            </div>

            <!-- Auth Buttons -->
            <div class="flex items-center gap-4">
                <a href="{{ route('login') }}" class="text-gray-700 hover:text-[#00D084] font-medium transition-colors">Login</a>
                <a href="{{ route('register') }}" class="bg-[#00D084] hover:bg-[#00966A] text-white px-6 py-2 rounded-lg font-medium transition-colors">Register</a>
            </div>

            <!-- Mobile Menu Button -->
            <button class="md:hidden p-2 hover:bg-gray-100 rounded-lg" aria-label="Menu">
                <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>

        <!-- Mobile Search Bar -->
        <div class="md:hidden pb-4">
            <form action="{{ route('products.index') }}" method="GET">
                <div class="relative">
                    <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input 
                        type="text" 
                        name="search"
                        placeholder="Search products..." 
                        value="{{ request('search') }}"
                        class="w-full pl-11 pr-4 h-11 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent"
                    >
                </div>
            </form>
        </div>
    </nav>
</header>

