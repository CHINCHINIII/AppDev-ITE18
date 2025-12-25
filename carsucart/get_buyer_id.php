<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'buyer@test.com')->first();
if ($user) {
    echo "User ID: " . $user->id . "\n";
} else {
    echo "User not found\n";
}

