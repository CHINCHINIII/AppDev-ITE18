<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$product = App\Models\Product::first();
if ($product) {
    echo "Product ID: " . $product->id . "\n";
} else {
    echo "No products found\n";
}

