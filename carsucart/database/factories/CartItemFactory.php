<?php

namespace Database\Factories;

use App\Models\CartItem;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartItemFactory extends Factory
{
    protected $model = CartItem::class;

    public function definition()
    {
        $cartId = Cart::inRandomOrder()->first()?->id ?? Cart::factory()->create()->id;
        $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
        $variant = ProductVariant::where('product_id', $product->id)->inRandomOrder()->first();

        $price = $product->price + ($variant?->extra_price ?? 0);
        $qty = $this->faker->numberBetween(1, 5);

        return [
            'cart_id' => $cartId,
            'product_id' => $product->id,
            'variant_id' => $variant?->id,
            'qty' => $qty,
            'price_at_add' => $price,
            'subtotal' => round($price * $qty, 2),
            'added_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
