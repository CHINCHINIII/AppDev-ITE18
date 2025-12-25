<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use App\Models\Cart;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        $buyerId = User::inRandomOrder()->first()?->id ?? User::factory()->create()->id;
        $cartId = Cart::where('user_id', $buyerId)->first()?->id ?? Cart::factory()->create(['user_id' => $buyerId])->id;

        // compute total from cart items if exists; otherwise random
        $total = $this->faker->randomFloat(2, 50, 1000);

        return [
            'buyer_id' => $buyerId,
            'cart_id' => $cartId,
            'status' => 'pending',
            'total' => $total,
            'delivery_method' => $this->faker->randomElement(['pickup','courier']),
            'pickup_location' => $this->faker->address(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
