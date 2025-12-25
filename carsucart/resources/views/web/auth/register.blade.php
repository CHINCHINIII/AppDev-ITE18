@extends('web.layouts.app')

@section('title', 'Register - CarSUcart')
@section('description', 'Create your CarSUcart account')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
        <!-- Logo -->
        <div class="text-center mb-8">
            <div class="flex justify-center mb-4">
                <div class="bg-[#00D084] p-3 rounded-lg">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
            </div>
            <h2 class="text-3xl font-bold text-[#333]">Create Account</h2>
            <p class="mt-2 text-gray-600">Join CarSUcart today</p>
        </div>

        <!-- Register Form -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
            <form method="POST" action="{{ route('register') }}" class="space-y-5">
                @csrf

                <!-- Full Name -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value="{{ old('name') }}" 
                        required 
                        autofocus
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent @error('name') border-red-500 @enderror"
                        placeholder="Enter your full name"
                    >
                    @error('name')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value="{{ old('email') }}" 
                        required
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent @error('email') border-red-500 @enderror"
                        placeholder="Enter your email"
                    >
                    @error('email')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Password -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent @error('password') border-red-500 @enderror"
                        placeholder="Create a password"
                    >
                    @error('password')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input 
                        type="password" 
                        id="password_confirmation" 
                        name="password_confirmation" 
                        required
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent"
                        placeholder="Confirm your password"
                    >
                </div>

                <!-- Account Type -->
                <div>
                    <label for="role" class="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    <select 
                        id="role" 
                        name="role" 
                        required
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent @error('role') border-red-500 @enderror"
                    >
                        <option value="">Select account type</option>
                        <option value="buyer" {{ old('role') == 'buyer' ? 'selected' : '' }}>Buyer</option>
                        <option value="seller" {{ old('role') == 'seller' ? 'selected' : '' }}>Seller</option>
                    </select>
                    @error('role')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Contact Number -->
                <div>
                    <label for="contact_no" class="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                    <input 
                        type="text" 
                        id="contact_no" 
                        name="contact_no" 
                        value="{{ old('contact_no') }}" 
                        required
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent @error('contact_no') border-red-500 @enderror"
                        placeholder="Enter your contact number"
                    >
                    @error('contact_no')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Store Name (Seller Only) -->
                <div id="store_name_field" style="display: none;">
                    <label for="store_name" class="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                    <input 
                        type="text" 
                        id="store_name" 
                        name="store_name" 
                        value="{{ old('store_name') }}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent @error('store_name') border-red-500 @enderror"
                        placeholder="Enter your store name"
                    >
                    @error('store_name')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="w-full bg-[#00D084] hover:bg-[#00966A] text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:ring-offset-2 mt-6"
                >
                    Create Account
                </button>
            </form>

            <!-- Login Link -->
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Already have an account? 
                    <a href="{{ route('login') }}" class="text-[#00D084] hover:text-[#00966A] font-medium">Sign in here</a>
                </p>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
const roleSelect = document.getElementById('role');
const storeField = document.getElementById('store_name_field');
const storeInput = document.getElementById('store_name');

function toggleStoreField() {
    const isSeller = roleSelect.value === 'seller';
    storeField.style.display = isSeller ? 'block' : 'none';
    storeInput.required = isSeller;
}

roleSelect.addEventListener('change', toggleStoreField);
document.addEventListener('DOMContentLoaded', toggleStoreField);
</script>
@endpush
@endsection
