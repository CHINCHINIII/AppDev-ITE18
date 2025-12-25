<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::find(1);
if ($user) {
    echo "User 1 exists: " . $user->email . "\n";
} else {
    echo "User 1 NOT found\n";
}

