<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics & Gadgets',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'School Supplies',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Clothing & Accessories',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Food & Snacks',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Books & Study Materials',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Health & Beauty',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sports & Fitness',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Home & Dorm Essentials',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Art & Crafts',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Services',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
