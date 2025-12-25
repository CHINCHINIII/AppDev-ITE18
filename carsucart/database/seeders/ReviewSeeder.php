<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $reviews = [
            [
                'user_id' => 6, // David Rodriguez
                'product_id' => 1, // Gaming Laptop
                'rating' => 5,
                'comment' => 'Excellent laptop! Perfect for my programming projects. The seller was very helpful and delivered on time.',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'user_id' => 7, // Lisa Marie Garcia
                'product_id' => 3, // Premium College Notebook Set
                'rating' => 4,
                'comment' => 'Great quality notebooks. The paper is smooth and perfect for writing. Good value for money.',
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'user_id' => 8, // Carlos Miguel Torres
                'product_id' => 7, // Homemade Chicken Sandwich
                'rating' => 5,
                'comment' => 'Delicious sandwich! Fresh ingredients and great taste. Perfect for lunch between classes.',
                'created_at' => now()->subHours(8),
                'updated_at' => now()->subHours(8),
            ],
            [
                'user_id' => 9, // Ana Patricia Flores
                'product_id' => 5, // CSU University T-Shirt
                'rating' => 4,
                'comment' => 'Nice quality t-shirt with the university logo. Comfortable fabric and good fit.',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'user_id' => 10, // Roberto Santos
                'product_id' => 9, // Programming Fundamentals Textbook
                'rating' => 5,
                'comment' => 'Very helpful textbook for my programming course. The seller kept it in good condition.',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
        ];

        foreach ($reviews as $review) {
            Review::create($review);
        }
    }
}
