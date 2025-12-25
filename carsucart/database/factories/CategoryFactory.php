<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition()
    {
        return [
            'name' => ucfirst($this->faker->unique()->word()),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
