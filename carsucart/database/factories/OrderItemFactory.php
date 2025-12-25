<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition()
    {
        $orderId = Order::inRandomOrder()->first()?->id ?? Order::factory()->create()->id;
        $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
        $variant = ProductVariant::where('product_id', $product->id)->inRandomOrder()->first();

        $price = $product->price + ($variant?->extra_price ?? 0);
        $qty = $this->faker->numberBetween(1, 5);
        $orderDate = $this->faker->dateTimeBetween('-60 days', 'now');

        return [
            'order_id' => $orderId,
            'product_id' => $product->id,
            'variant_id' => $variant?->id,
            'qty' => $qty,
            'price_at_purchase' => $price,
            'subtotal' => round($price * $qty, 2),
            'order_date' => $orderDate,
            'order_week' => intval($orderDate->format('W')),
            'order_month' => intval($orderDate->format('n')),
            'order_year' => intval($orderDate->format('Y')),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
