<?php

use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

echo "Resetting Admin Password...\n";

$email = 'admin@carsucart.com';
$password = 'Admin123!';

$admin = Admin::where('email', $email)->first();

if ($admin) {
    // We update the password. The 'hashed' cast in the model might automatically hash it
    // if we set it as a property, but to be absolutely sure and explicit with the facade:
    $admin->password = Hash::make($password);
    
    // If the cast is active, setting it might double hash if we are not careful?
    // Let's check how casts work. If cast is 'hashed', Laravel expects the value 
    // being set to be the PLAIN text, and it hashes it on save.
    // HOWEVER, if we use Hash::make(), we are passing a hash.
    // If the model casts 'password' => 'hashed', we should pass the PLAIN password 
    // and let Laravel hash it.
    
    // Let's try to disable the mutator for a moment or just use update() on the query builder
    // to bypass the model's set mutator if we are unsure, but `Hash::make` is safer if we direct update.
    
    // safest route: Query Builder update avoids Model events/mutators for the specific field usually
    // but the 'casts' feature works on Model save.
    
    // Let's use the Model way but assign the PLAIN password because of the 'hashed' cast.
    $admin->password = $password; 
    $admin->save();
    
    echo "Password updated for {$email}.\n";
    echo "New Password: {$password}\n";
} else {
    echo "Admin not found!\n";
}
