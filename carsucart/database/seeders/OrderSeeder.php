<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $orders = [
            [
                'buyer_id' => 6, // David Rodriguez
                'cart_id' => 1,
                'status' => 'completed',
                'total' => 1200.00,
                'delivery_method' => 'pickup',
                'pickup_location' => 'CSU Main Campus - Library',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(3),
            ],
            [
                'buyer_id' => 7, // Lisa Marie Garcia
                'cart_id' => 2,
                'status' => 'pending',
                'total' => 350.00,
                'delivery_method' => 'pickup',
                'pickup_location' => 'CSU Main Campus - Student Center',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'buyer_id' => 8, // Carlos Miguel Torres
                'cart_id' => 3,
                'status' => 'paid',
                'total' => 75.00,
                'delivery_method' => 'pickup',
                'pickup_location' => 'CSU Main Campus - Cafeteria',
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subHours(12),
            ],
            [
                'buyer_id' => 9, // Ana Patricia Flores
                'cart_id' => 4,
                'status' => 'completed',
                'total' => 250.00,
                'delivery_method' => 'pickup',
                'pickup_location' => 'CSU Main Campus - Library',
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(5),
            ],
            [
                'buyer_id' => 10, // Roberto Santos
                'cart_id' => 5,
                'status' => 'cancelled',
                'total' => 45000.00,
                'delivery_method' => 'pickup',
                'pickup_location' => 'CSU Main Campus - Student Center',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(2),
            ],
        ];

        foreach ($orders as $order) {
            Order::create($order);
        }
    }
}
