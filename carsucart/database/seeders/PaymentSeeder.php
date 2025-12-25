<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $payments = [
            [
                'order_id' => 1,
                'method' => 'gcash',
                'amount' => 1200.00,
                'status' => 'success',
                'paid_at' => now()->subDays(4),
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(4),
            ],
            [
                'order_id' => 2,
                'method' => 'cash_on_pickup',
                'amount' => 350.00,
                'status' => 'pending',
                'paid_at' => null,
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'order_id' => 3,
                'method' => 'gcash',
                'amount' => 75.00,
                'status' => 'success',
                'paid_at' => now()->subHours(10),
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subHours(10),
            ],
            [
                'order_id' => 4,
                'method' => 'cash_on_pickup',
                'amount' => 250.00,
                'status' => 'success',
                'paid_at' => now()->subDays(6),
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(6),
            ],
            [
                'order_id' => 5,
                'method' => 'gcash',
                'amount' => 45000.00,
                'status' => 'refunded',
                'paid_at' => now()->subDays(3),
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(2),
            ],
        ];

        foreach ($payments as $payment) {
            Payment::create($payment);
        }
    }
}
