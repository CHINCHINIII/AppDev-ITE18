<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductVariant;

class ProductVariantSeeder extends Seeder
{
    public function run(): void
    {
        $variants = [
            // Gaming Laptop variants
            [
                'product_id' => 1, // Gaming Laptop - ASUS ROG
                'name' => 'Color',
                'value' => 'Black',
                'price_adjustment' => 0.00,
                'stock' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => 1,
                'name' => 'Color',
                'value' => 'Silver',
                'price_adjustment' => 2000.00,
                'stock' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Wireless Gaming Mouse variants
            [
                'product_id' => 2, // Wireless Gaming Mouse
                'name' => 'Color',
                'value' => 'Black',
                'price_adjustment' => 0.00,
                'stock' => 8,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => 2,
                'name' => 'Color',
                'value' => 'White',
                'price_adjustment' => 100.00,
                'stock' => 7,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // CSU University T-Shirt variants
            [
                'product_id' => 5, // CSU University T-Shirt
                'name' => 'Size',
                'value' => 'Small',
                'price_adjustment' => 0.00,
                'stock' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => 5,
                'name' => 'Size',
                'value' => 'Medium',
                'price_adjustment' => 0.00,
                'stock' => 8,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => 5,
                'name' => 'Size',
                'value' => 'Large',
                'price_adjustment' => 0.00,
                'stock' => 7,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => 5,
                'name' => 'Size',
                'value' => 'Extra Large',
                'price_adjustment' => 50.00,
                'stock' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Student Backpack variants
            [
                'product_id' => 6, // Student Backpack
                'name' => 'Color',
                'value' => 'Black',
                'price_adjustment' => 0.00,
                'stock' => 8,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => 6,
                'name' => 'Color',
                'value' => 'Blue',
                'price_adjustment' => 0.00,
                'stock' => 6,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => 6,
                'name' => 'Color',
                'value' => 'Red',
                'price_adjustment' => 100.00,
                'stock' => 6,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($variants as $variant) {
            ProductVariant::create($variant);
        }
    }
}