<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition()
    {
        $order = Order::inRandomOrder()->first() ?? Order::factory()->create();
        return [
            'order_id' => $order->id,
            'method' => $this->faker->randomElement(['cash_on_pickup','gcash']),
            'amount' => $order->total ?? $this->faker->randomFloat(2, 50, 500),
            'status' => $this->faker->randomElement(['pending','success','failed']),
            'paid_at' => $this->faker->optional()->dateTimeBetween('-30 days', 'now'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
