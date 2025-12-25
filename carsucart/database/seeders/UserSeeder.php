<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            // Admin Users
            [
                'name' => 'Dr. Maria Santos',
                'email' => 'admin@carsucart.csu.edu.ph',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'contact_no' => '09123456789',
                'store_name' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Student Sellers
            [
                'name' => 'John Michael Cruz',
                'email' => 'john.cruz@student.csu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'seller',
                'contact_no' => '09123456790',
                'store_name' => 'JM Tech Solutions',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sarah Grace Mendoza',
                'email' => 'sarah.mendoza@student.csu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'seller',
                'contact_no' => '09123456791',
                'store_name' => 'Sarah\'s Study Hub',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mark Anthony Reyes',
                'email' => 'mark.reyes@student.csu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'seller',
                'contact_no' => '09123456792',
                'store_name' => 'Mark\'s Fashion Corner',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jennifer Lopez',
                'email' => 'jennifer.lopez@student.csu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'seller',
                'contact_no' => '09123456793',
                'store_name' => 'Jen\'s Healthy Bites',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Student Buyers
            [
                'name' => 'David Rodriguez',
                'email' => 'david.rodriguez@student.csu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
                'contact_no' => '09123456794',
                'store_name' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lisa Marie Garcia',
                'email' => 'lisa.garcia@student.csu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
                'contact_no' => '09123456795',
                'store_name' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Carlos Miguel Torres',
                'email' => 'carlos.torres@student.csu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
                'contact_no' => '09123456796',
                'store_name' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ana Patricia Flores',
                'email' => 'ana.flores@student.csu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
                'contact_no' => '09123456797',
                'store_name' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Roberto Santos',
                'email' => 'roberto.santos@student.csu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
                'contact_no' => '09123456798',
                'store_name' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
