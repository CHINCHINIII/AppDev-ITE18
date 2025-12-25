<?php

/**
 * Fix Admin Passwords Script
 * 
 * This script resets admin passwords that may have been double-hashed.
 * Run this after fixing the code to ensure admin login works.
 * 
 * Usage: php fix_admin_passwords.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Admin;

echo "========================================\n";
echo "Fixing Admin Passwords\n";
echo "========================================\n\n";

// Default password for all admins
$defaultPassword = 'admin123';

// Get all admins
$admins = Admin::all();

if ($admins->isEmpty()) {
    echo "No admin users found. Run: php artisan db:seed --class=AdminSeeder\n";
    exit(1);
}

echo "Found " . $admins->count() . " admin(s). Resetting passwords...\n\n";

foreach ($admins as $admin) {
    // Set plain text password - the 'hashed' cast will hash it automatically
    $admin->password = $defaultPassword;
    $admin->save();
    
    echo "✓ Reset password for: {$admin->email}\n";
}

echo "\n========================================\n";
echo "Password reset complete!\n";
echo "========================================\n";
echo "\nDefault password for all admins: {$defaultPassword}\n";
echo "\nYou can now log in with:\n";
echo "- Email: admin@carsucart.csu.edu.ph\n";
echo "- Password: {$defaultPassword}\n";
echo "\n";



