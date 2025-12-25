<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            AdminSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            ProductVariantSeeder::class,
            CartSeeder::class,
            CartItemSeeder::class,
            OrderSeeder::class,
            OrderItemSeeder::class,
            PaymentSeeder::class,
            ReviewSeeder::class,
        ]);

        // Seed 10 products for each category
        $categories = \App\Models\Category::all();
        foreach ($categories as $category) {
            \App\Models\Product::factory()->count(10)->create([
                'category_id' => $category->id,
            ]);
        }

        // Seed 10 reviews for each product
        $products = \App\Models\Product::all();
        foreach ($products as $product) {
            \App\Models\Review::factory()->count(10)->create([
                'product_id' => $product->id,
                'user_id' => \App\Models\User::inRandomOrder()->first()->id,
            ]);
        }
    }
}
