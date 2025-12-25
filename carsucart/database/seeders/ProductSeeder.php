<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // Electronics & Gadgets
            [
                'seller_id' => 2, // John Michael Cruz
                'category_id' => 1,
                'sku' => 'LAPTOP001',
                'name' => 'Gaming Laptop - ASUS ROG',
                'description' => 'High-performance gaming laptop perfect for computer science students. Intel i7 processor, 16GB RAM, 512GB SSD, RTX 3060 graphics card.',
                'price' => 45000.00,
                'stock' => 3,
                'unit' => 'piece',
                'brand' => 'ASUS',
                'is_active' => true,
                'image_url' => 'https://loremflickr.com/400/400/gaming+laptop',
                'added_week' => now()->week,
                'added_month' => now()->month,
                'added_year' => now()->year,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'seller_id' => 2,
                'category_id' => 1,
                'sku' => 'MOUSE001',
                'name' => 'Wireless Gaming Mouse',
                'description' => 'Ergonomic wireless gaming mouse with RGB lighting. Perfect for programming and gaming sessions.',
                'price' => 1200.00,
                'stock' => 15,
                'unit' => 'piece',
                'brand' => 'Logitech',
                'is_active' => true,
                'image_url' => 'https://loremflickr.com/400/400/gaming+mouse',
                'added_week' => now()->week,
                'added_month' => now()->month,
                'added_year' => now()->year,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // School Supplies
            [
                'seller_id' => 3, // Sarah Grace Mendoza
                'category_id' => 2,
                'sku' => 'NOTEBOOK001',
                'name' => 'Premium College Notebook Set',
                'description' => 'Set of 5 college-ruled notebooks with durable covers. Perfect for taking notes in all your classes.',
                'price' => 250.00,
                'stock' => 50,
                'unit' => 'set',
                'brand' => 'Oxford',
                'is_active' => true,
                'image_url' => 'https://loremflickr.com/400/400/notebook',
                'added_week' => now()->week,
                'added_month' => now()->month,
                'added_year' => now()->year,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'seller_id' => 3,
                'category_id' => 2,
                'sku' => 'PEN001',
                'name' => 'Ballpoint Pen Set',
                'description' => 'Set of 12 smooth-writing ballpoint pens in various colors. Great for note-taking and assignments.',
                'price' => 80.00,
                'stock' => 100,
                'unit' => 'set',
                'brand' => 'Pilot',
                'is_active' => true,
                'image_url' => 'https://loremflickr.com/400/400/pen',
                'added_week' => now()->week,
                'added_month' => now()->month,
                'added_year' => now()->year,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Clothing & Accessories
            [
                'seller_id' => 4, // Mark Anthony Reyes
                'category_id' => 3,
                'sku' => 'SHIRT001',
                'name' => 'CSU University T-Shirt',
                'description' => 'Comfortable cotton t-shirt with Caraga State University logo. Available in multiple sizes.',
                'price' => 350.00,
                'stock' => 25,
                'unit' => 'piece',
                'brand' => 'CSU Official',
                'is_active' => true,
                'image_url' => 'https://loremflickr.com/400/400/tshirt',
                'added_week' => now()->week,
                'added_month' => now()->month,
                'added_year' => now()->year,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'seller_id' => 4,
                'category_id' => 3,
                'sku' => 'BAG001',
                'name' => 'Student Backpack',
                'description' => 'Durable backpack perfect for carrying laptops and books. Multiple compartments and laptop sleeve included.',
                'price' => 1200.00,
                'stock' => 20,
                'unit' => 'piece',
                'brand' => 'Jansport',
                'is_active' => true,
                'image_url' => 'https://loremflickr.com/400/400/backpack',
                'added_week' => now()->week,
                'added_month' => now()->month,
                'added_year' => now()->year,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Food & Snacks
            [
                'seller_id' => 5, // Jennifer Lopez
                'category_id' => 4,
                'sku' => 'SANDWICH001',
                'name' => 'Homemade Chicken Sandwich',
                'description' => 'Fresh homemade chicken sandwich with lettuce, tomato, and special sauce. Perfect for lunch between classes.',
                'price' => 75.00,
                'stock' => 30,
                'unit' => 'piece',
                'brand' => 'Jen\'s Kitchen',
                'is_active' => true,
                'image_url' => 'https://loremflickr.com/400/400/sandwich',
                'added_week' => now()->week,
                'added_month' => now()->month,
                'added_year' => now()->year,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'seller_id' => 5,
                'category_id' => 4,
                'sku' => 'COOKIE001',
                'name' => 'Chocolate Chip Cookies',
                'description' => 'Freshly baked chocolate chip cookies. Soft and chewy, perfect for study breaks.',
                'price' => 25.00,
                'stock' => 50,
                'unit' => 'piece',
                'brand' => 'Jen\'s Bakery',
                'is_active' => true,
                'image_url' => 'https://loremflickr.com/400/400/cookies',
                'added_week' => now()->week,
                'added_month' => now()->month,
                'added_year' => now()->year,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Books & Study Materials
            [
                'seller_id' => 3,
                'category_id' => 5,
                'sku' => 'BOOK001',
                'name' => 'Programming Fundamentals Textbook',
                'description' => 'Used textbook for Programming Fundamentals course. Good condition with minimal highlighting.',
                'price' => 800.00,
                'stock' => 5,
                'unit' => 'piece',
                'brand' => 'Pearson',
                'is_active' => true,
                'image_url' => 'https://loremflickr.com/400/400/textbook',
                'added_week' => now()->week,
                'added_month' => now()->month,
                'added_year' => now()->year,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'seller_id' => 3,
                'category_id' => 5,
                'sku' => 'CALCULATOR001',
                'name' => 'Scientific Calculator',
                'description' => 'Casio scientific calculator perfect for engineering and math courses. Solar powered with dual power.',
                'price' => 450.00,
                'stock' => 12,
                'unit' => 'piece',
                'brand' => 'Casio',
                'is_active' => true,
                'image_url' => 'https://loremflickr.com/400/400/calculator',
                'added_week' => now()->week,
                'added_month' => now()->month,
                'added_year' => now()->year,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
