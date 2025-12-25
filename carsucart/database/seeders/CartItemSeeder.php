<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CartItem;

class CartItemSeeder extends Seeder
{
    public function run(): void
    {
        $cartItems = [
            [
                'cart_id' => 1, // David Rodriguez's cart
                'product_id' => 2, // Wireless Gaming Mouse
                'variant_id' => null,
                'qty' => 1,
                'price_at_add' => 1200.00,
                'subtotal' => 1200.00,
                'added_at' => now()->subDays(5),
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'cart_id' => 2, // Lisa Marie Garcia's cart
                'product_id' => 5, // CSU University T-Shirt
                'variant_id' => null,
                'qty' => 1,
                'price_at_add' => 350.00,
                'subtotal' => 350.00,
                'added_at' => now()->subDays(2),
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'cart_id' => 3, // Carlos Miguel Torres's cart
                'product_id' => 7, // Homemade Chicken Sandwich
                'variant_id' => null,
                'qty' => 1,
                'price_at_add' => 75.00,
                'subtotal' => 75.00,
                'added_at' => now()->subDays(1),
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'cart_id' => 4, // Ana Patricia Flores's cart
                'product_id' => 3, // Premium College Notebook Set
                'variant_id' => null,
                'qty' => 1,
                'price_at_add' => 250.00,
                'subtotal' => 250.00,
                'added_at' => now()->subDays(7),
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            [
                'cart_id' => 5, // Roberto Santos's cart
                'product_id' => 1, // Gaming Laptop
                'variant_id' => null,
                'qty' => 1,
                'price_at_add' => 45000.00,
                'subtotal' => 45000.00,
                'added_at' => now()->subDays(3),
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
        ];

        foreach ($cartItems as $cartItem) {
            CartItem::create($cartItem);
        }
    }
}
