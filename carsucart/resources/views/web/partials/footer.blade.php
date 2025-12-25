<footer class="bg-[#1a1a1a] text-white mt-16">
    <div class="max-w-7xl mx-auto px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <!-- Brand -->
            <div>
                <div class="flex items-center gap-2 mb-4">
                    <div class="bg-[#00D084] p-2 rounded-lg">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <span class="text-xl font-semibold">CarSUcart</span>
                </div>
                <p class="text-gray-400 text-sm leading-relaxed">
                    Your trusted campus marketplace for Caraga State University students.
                </p>
            </div>
            
            <!-- Quick Links -->
            <div>
                <h4 class="text-sm font-semibold mb-4">Quick Links</h4>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li><a href="#" class="hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">How It Works</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">FAQs</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
                </ul>
            </div>
            
            <!-- For Sellers -->
            <div>
                <h4 class="text-sm font-semibold mb-4">For Sellers</h4>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li><a href="{{ route('seller.register') }}" class="hover:text-white transition-colors">Start Selling</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">Seller Guidelines</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">Success Stories</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">Resources</a></li>
                </ul>
            </div>
            
            <!-- Support -->
            <div>
                <h4 class="text-sm font-semibold mb-4">Support</h4>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">Safety Tips</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
            </div>
        </div>
        
        <div class="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {{ date('Y') }} CarSUcart. Powered by Caraga State University. All rights reserved.</p>
        </div>
    </div>
</footer>

