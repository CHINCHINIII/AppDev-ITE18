<?php

namespace Database\Factories;

use App\Models\ProductVariant;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

    public function definition()
    {
        $productId = Product::inRandomOrder()->first()?->id ?? Product::factory()->create()->id;

        return [
            'product_id' => $productId,
            'variant_sku' => strtoupper(Str::random(6)),
            'variant_name' => $this->faker->randomElement(['Small','Medium','Large','Red','Blue','Pack of 3']),
            'extra_price' => $this->faker->randomFloat(2, 0, 50),
            'stock' => $this->faker->numberBetween(0, 50),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
