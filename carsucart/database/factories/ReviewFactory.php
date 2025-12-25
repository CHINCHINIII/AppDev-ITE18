<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition()
    {
        $productId = Product::inRandomOrder()->first()?->id ?? Product::factory()->create()->id;
        $userId = User::inRandomOrder()->first()?->id ?? User::factory()->create()->id;

        return [
            'product_id' => $productId,
            'user_id' => $userId,
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->optional()->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
