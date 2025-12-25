<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cart;
use App\Models\User;

class CartSeeder extends Seeder
{
    public function run(): void
    {
        // Create carts for buyer users only
        $buyers = User::where('role', 'buyer')->get();
        foreach ($buyers as $buyer) {
            Cart::create([
                'user_id' => $buyer->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
