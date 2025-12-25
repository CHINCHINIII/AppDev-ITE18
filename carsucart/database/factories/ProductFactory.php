<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        // ensure seller & category exist (or create)
        $sellerId = User::inRandomOrder()->first()?->id ?? User::factory()->create()->id;
        
        // Try to get a category, if none, create one. 
        // Note: In DatabaseSeeder we iterate categories and pass category_id, so this fallback is mostly for standalone factory usage.
        $category = Category::inRandomOrder()->first();
        $categoryId = $category?->id ?? Category::factory()->create()->id;
        
        // If the factory is called with a specific category_id (via state or override), use that to pick the item.
        // We can access attributes being passed to create() via some magic, but standard Factory 'definition' runs before overrides are applied if we aren't careful.
        // However, Laravel Factories merge the return of definition() with the overrides. 
        // To make the name match the category_id passed in the seeder, we need to be clever.
        // Since we can't easily know the overridden category_id inside definition() before it's merged,
        // we will define a closure state or just randomize effectively.
        // BUT, the DatabaseSeeder passes ['category_id' => $id]. 
        // A better approach for correlated data is to use a method or just handle the randomization generic enough, 
        // OR rely on the fact that we can generate a name/image pair *after* making the instance if we used a configure callback, 
        // but that's complex.
        
        // SIMPLIFICATION:
        // We will assume that if we are generating random products, we pick a random category first here, 
        // then pick a product FOR that category.
        // If the seeder overrides category_id, the name might mismatch the category. 
        // To fix this, we will use the `configure()` method to update the name/image based on the final category_id.
        
        $createdAt = $this->faker->dateTimeBetween('-120 days', 'now');

        return [
            'seller_id' => $sellerId,
            'category_id' => $categoryId, // Default, will be overridden by Seeder
            'sku' => strtoupper(Str::random(8)),
            'name' => 'Pending Name', // Will be set in configure()
            'description' => $this->faker->paragraph(3),
            'price' => $this->faker->randomFloat(2, 50, 5000),
            'stock' => $this->faker->numberBetween(5, 100),
            'unit' => 'piece',
            'brand' => 'Generic',
            'is_active' => true,
            'image_url' => '', // Will be set in configure()
            'added_week' => intval($createdAt->format('W')),
            'added_month' => intval($createdAt->format('n')),
            'added_year' => intval($createdAt->format('Y')),
            'created_at' => $createdAt,
            'updated_at' => now(),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure()
    {
        return $this->afterMaking(function (Product $product) {
            $this->setProductDetails($product);
        })->afterCreating(function (Product $product) {
            // In case we need to do something after saving, but afterMaking handles the attributes
            if ($product->name === 'Pending Name') {
                 $this->setProductDetails($product);
                 $product->save();
            }
        });
    }

    private function setProductDetails(Product $product)
    {
        $items = [
            // 1. Electronics
            1 => [
                ['name' => 'ASUS ROG Zephyrus', 'kw' => 'gaming laptop', 'brand' => 'ASUS', 'price' => 85000],
                ['name' => 'iPhone 14 Pro', 'kw' => 'iphone', 'brand' => 'Apple', 'price' => 65000],
                ['name' => 'Samsung Galaxy S23', 'kw' => 'smartphone samsung', 'brand' => 'Samsung', 'price' => 55000],
                ['name' => 'Logitech G502 Mouse', 'kw' => 'gaming mouse', 'brand' => 'Logitech', 'price' => 2500],
                ['name' => 'Sony WH-1000XM5', 'kw' => 'headphones', 'brand' => 'Sony', 'price' => 18000],
                ['name' => 'iPad Air 5', 'kw' => 'tablet ipad', 'brand' => 'Apple', 'price' => 35000],
                ['name' => 'Mechanical Keyboard', 'kw' => 'keyboard', 'brand' => 'Keychron', 'price' => 4500],
                ['name' => 'Canon EOS R50', 'kw' => 'camera', 'brand' => 'Canon', 'price' => 45000],
                ['name' => 'JBL Flip 6 Speaker', 'kw' => 'speaker', 'brand' => 'JBL', 'price' => 6000],
                ['name' => 'Power Bank 20000mAh', 'kw' => 'powerbank', 'brand' => 'Anker', 'price' => 1500],
            ],
            // 2. School Supplies
            2 => [
                ['name' => 'Cattleya Notebook Set', 'kw' => 'notebook', 'brand' => 'Cattleya', 'price' => 250],
                ['name' => 'Pilot G-Tech Pen Set', 'kw' => 'pen', 'brand' => 'Pilot', 'price' => 400],
                ['name' => 'Yellow Pad Paper (Whole)', 'kw' => 'paper', 'brand' => 'Victory', 'price' => 80],
                ['name' => 'Casio Scientific Calculator', 'kw' => 'calculator', 'brand' => 'Casio', 'price' => 1200],
                ['name' => 'Clearbook Folder (Long)', 'kw' => 'folder', 'brand' => 'Generic', 'price' => 45],
                ['name' => 'Highlighter Set Pastel', 'kw' => 'highlighter', 'brand' => 'Stabilo', 'price' => 350],
                ['name' => 'Correction Tape Box', 'kw' => 'stationery', 'brand' => 'Plus', 'price' => 120],
                ['name' => 'Scissors', 'kw' => 'scissors', 'brand' => 'Maped', 'price' => 60],
                ['name' => 'Bond Paper Ream (A4)', 'kw' => 'paper stack', 'brand' => 'Hard Copy', 'price' => 280],
                ['name' => 'Index Cards 1/2', 'kw' => 'index cards', 'brand' => 'Generic', 'price' => 30],
            ],
            // 3. Clothing
            3 => [
                ['name' => 'CSU Department Shirt', 'kw' => 't-shirt', 'brand' => 'Local', 'price' => 350],
                ['name' => 'Denim Jacket', 'kw' => 'jacket', 'brand' => 'Levis', 'price' => 1500],
                ['name' => 'Nike Air Force 1', 'kw' => 'sneakers', 'brand' => 'Nike', 'price' => 5500],
                ['name' => 'Adidas Running Shorts', 'kw' => 'shorts', 'brand' => 'Adidas', 'price' => 1200],
                ['name' => 'Cotton Hoodie Black', 'kw' => 'hoodie', 'brand' => 'H&M', 'price' => 999],
                ['name' => 'Baseball Cap', 'kw' => 'cap', 'brand' => 'New Era', 'price' => 800],
                ['name' => 'Tote Bag Canvas', 'kw' => 'tote bag', 'brand' => 'Local', 'price' => 150],
                ['name' => 'Formal Slacks', 'kw' => 'pants', 'brand' => 'Uniqlo', 'price' => 1490],
                ['name' => 'White Polo Shirt', 'kw' => 'polo shirt', 'brand' => 'Lacoste', 'price' => 2500],
                ['name' => 'Socks (3 Pairs)', 'kw' => 'socks', 'brand' => 'Burlington', 'price' => 300],
            ],
            // 4. Food
            4 => [
                ['name' => 'Homemade Brownies (Box)', 'kw' => 'brownie', 'brand' => 'Home Baked', 'price' => 150],
                ['name' => 'Chocolate Chip Cookies', 'kw' => 'cookies', 'brand' => 'Home Baked', 'price' => 120],
                ['name' => 'Banana Cake Slice', 'kw' => 'banana bread', 'brand' => 'Local', 'price' => 35],
                ['name' => 'Yema Cake Tub', 'kw' => 'cake', 'brand' => 'Rodellas', 'price' => 250],
                ['name' => 'Siomai with Rice', 'kw' => 'dimsum', 'brand' => 'Master Siomai', 'price' => 65],
                ['name' => 'Fruit Salad Jar', 'kw' => 'fruit salad', 'brand' => 'Fresh', 'price' => 100],
                ['name' => 'Graham Balls (10pcs)', 'kw' => 'dessert', 'brand' => 'Sweet Tooth', 'price' => 80],
                ['name' => 'Iced Coffee Vanilla', 'kw' => 'iced coffee', 'brand' => 'Daily Brew', 'price' => 90],
                ['name' => 'Tuna Sandwich', 'kw' => 'sandwich', 'brand' => 'Fresh', 'price' => 50],
                ['name' => 'Lumpia Shanghai (12pcs)', 'kw' => 'spring rolls', 'brand' => 'Mommy C', 'price' => 120],
            ],
             // 5. Books
            5 => [
                ['name' => 'Calculus Early Transcendentals', 'kw' => 'textbook', 'brand' => 'Pearson', 'price' => 850],
                ['name' => 'Introduction to Algorithms', 'kw' => 'book computer', 'brand' => 'MIT Press', 'price' => 1200],
                ['name' => 'Clean Code', 'kw' => 'coding book', 'brand' => 'Pearson', 'price' => 950],
                ['name' => 'Rich Dad Poor Dad', 'kw' => 'book', 'brand' => 'Plata', 'price' => 450],
                ['name' => 'Atomic Habits', 'kw' => 'book cover', 'brand' => 'Penguin', 'price' => 600],
                ['name' => 'Chemistry 101 Reviewer', 'kw' => 'study notes', 'brand' => 'Local', 'price' => 200],
                ['name' => 'Engineering Mechanics', 'kw' => 'textbook', 'brand' => 'Wiley', 'price' => 700],
                ['name' => 'Medical Dictionary', 'kw' => 'dictionary', 'brand' => 'Merriam', 'price' => 1500],
                ['name' => 'Noli Me Tangere', 'kw' => 'old book', 'brand' => 'National', 'price' => 180],
                ['name' => 'Java Programming Deitel', 'kw' => 'java book', 'brand' => 'Pearson', 'price' => 550],
            ],
             // 6. Health & Beauty
            6 => [
                ['name' => 'Sunscreen SPF 50', 'kw' => 'sunscreen', 'brand' => 'Fairy Skin', 'price' => 350],
                ['name' => 'Face Mask Box', 'kw' => 'face mask', 'brand' => 'Generic', 'price' => 50],
                ['name' => 'Lip Tint Set', 'kw' => 'makeup', 'brand' => 'Colourette', 'price' => 299],
                ['name' => 'Alcohol 70% 500ml', 'kw' => 'bottle', 'brand' => 'Green Cross', 'price' => 120],
                ['name' => 'Aloe Vera Gel', 'kw' => 'cosmetic', 'brand' => 'Luxe Organix', 'price' => 250],
            ],
             // 7. Sports
            7 => [
                ['name' => 'Basketball Molten', 'kw' => 'basketball', 'brand' => 'Molten', 'price' => 1200],
                ['name' => 'Badminton Racket', 'kw' => 'badminton', 'brand' => 'Yonex', 'price' => 1500],
                ['name' => 'Yoga Mat', 'kw' => 'yoga mat', 'brand' => 'Generic', 'price' => 450],
                ['name' => 'Volleyball', 'kw' => 'volleyball', 'brand' => 'Mikasa', 'price' => 1100],
                ['name' => 'Dumbbells 5lbs', 'kw' => 'dumbbell', 'brand' => 'Generic', 'price' => 800],
            ],
             // 8. Home
            8 => [
                ['name' => 'Desk Lamp LED', 'kw' => 'desk lamp', 'brand' => 'Omni', 'price' => 450],
                ['name' => 'Electric Fan Clip-on', 'kw' => 'fan', 'brand' => 'Generic', 'price' => 350],
                ['name' => 'Bed Sheet Single', 'kw' => 'bed sheet', 'brand' => 'Canadian', 'price' => 500],
                ['name' => 'Extension Cord', 'kw' => 'extension cord', 'brand' => 'Panther', 'price' => 600],
                ['name' => 'Tumbler Aquaflask', 'kw' => 'water bottle', 'brand' => 'Aquaflask', 'price' => 850],
            ],
             // 9. Arts
            9 => [
                ['name' => 'Acrylic Paint Set', 'kw' => 'paint', 'brand' => 'Reeves', 'price' => 650],
                ['name' => 'Canvas 12x12', 'kw' => 'canvas art', 'brand' => 'Generic', 'price' => 120],
                ['name' => 'Paint Brushes', 'kw' => 'paint brush', 'brand' => 'Generic', 'price' => 200],
                ['name' => 'Sketchpad A3', 'kw' => 'sketchbook', 'brand' => 'Berkeley', 'price' => 150],
                ['name' => 'Colored Pencils 24s', 'kw' => 'color pencil', 'brand' => 'Faber Castell', 'price' => 450],
            ],
             // 10. Services
            10 => [
                ['name' => 'Printing Service (Per Page)', 'kw' => 'printer', 'brand' => 'Service', 'price' => 5],
                ['name' => 'Laptop Reformat', 'kw' => 'repair', 'brand' => 'Service', 'price' => 500],
                ['name' => 'Binding Service', 'kw' => 'documents', 'brand' => 'Service', 'price' => 150],
                ['name' => 'Graphic Design Commission', 'kw' => 'graphic design', 'brand' => 'Service', 'price' => 1000],
                ['name' => 'Tutoring Math', 'kw' => 'teaching', 'brand' => 'Service', 'price' => 300],
            ]
        ];

        $catId = $product->category_id;
        
        // Fallback for unknown categories
        $defaultItems = [['name' => 'Generic Product', 'kw' => 'product', 'brand' => 'Generic', 'price' => 100]];
        
        $categoryItems = $items[$catId] ?? $defaultItems;
        $item = $this->faker->randomElement($categoryItems);

        $product->name = $item['name'];
        $product->brand = $item['brand'];
        $product->price = $item['price'];
        // Use loremflickr for specific keyword images
        $product->image_url = 'https://loremflickr.com/400/400/' . urlencode($item['kw']) . '?random=' . Str::random(5);
        $product->description = "High quality {$item['name']} from {$item['brand']}. Perfect for students. Condition is verified. Available for meet up or delivery.";
    }
}
