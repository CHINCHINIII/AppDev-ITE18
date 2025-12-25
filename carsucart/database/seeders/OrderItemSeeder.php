<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrderItem;

class OrderItemSeeder extends Seeder
{
    public function run(): void
    {
        $orderItems = [
            [
                'order_id' => 1, // David Rodriguez's order
                'product_id' => 2, // Wireless Gaming Mouse
                'variant_id' => null,
                'qty' => 1,
                'price_at_purchase' => 1200.00,
                'subtotal' => 1200.00,
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'order_id' => 2, // Lisa Marie Garcia's order
                'product_id' => 5, // CSU University T-Shirt
                'variant_id' => null,
                'qty' => 1,
                'price_at_purchase' => 350.00,
                'subtotal' => 350.00,
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'order_id' => 3, // Carlos Miguel Torres's order
                'product_id' => 7, // Homemade Chicken Sandwich
                'variant_id' => null,
                'qty' => 1,
                'price_at_purchase' => 75.00,
                'subtotal' => 75.00,
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'order_id' => 4, // Ana Patricia Flores's order
                'product_id' => 3, // Premium College Notebook Set
                'variant_id' => null,
                'qty' => 1,
                'price_at_purchase' => 250.00,
                'subtotal' => 250.00,
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            [
                'order_id' => 5, // Roberto Santos's order (cancelled)
                'product_id' => 1, // Gaming Laptop
                'variant_id' => null,
                'qty' => 1,
                'price_at_purchase' => 45000.00,
                'subtotal' => 45000.00,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
        ];

        foreach ($orderItems as $orderItem) {
            OrderItem::create($orderItem);
        }
    }
}
