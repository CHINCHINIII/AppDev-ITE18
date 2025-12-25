<?php

use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

echo "Testing Admin Login...\n";

$email = 'admin@carsucart.com';
$password = 'Admin123!';

$admin = Admin::where('email', $email)->first();

if (!$admin) {
    echo "User not found.\n";
    exit(1);
}

echo "Stored Password Hash: " . $admin->password . "\n";

if (Hash::check($password, $admin->password)) {
    echo "SUCCESS: Password matches!\n";
} else {
    echo "FAILURE: Password does NOT match.\n";
}

