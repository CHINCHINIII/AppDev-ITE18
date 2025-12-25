<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admins = [
            [
                'name' => 'Dr. Maria Santos',
                'email' => 'admin@carsucart.csu.edu.ph',
                'password' => 'admin123', // Cast will automatically hash this
                'role' => 'super_admin',
                'contact_no' => '09123456789',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Prof. Juan Dela Cruz',
                'email' => 'juan.delacruz@csu.edu.ph',
                'password' => 'admin123', // Cast will automatically hash this
                'role' => 'admin',
                'contact_no' => '09123456790',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ms. Ana Rodriguez',
                'email' => 'ana.rodriguez@csu.edu.ph',
                'password' => 'admin123', // Cast will automatically hash this
                'role' => 'admin',
                'contact_no' => '09123456791',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($admins as $admin) {
            Admin::create($admin);
        }
    }
}