<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        $role = $this->faker->randomElement(['buyer','seller']);
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            // use bcrypt for now; in real app use Hash::make
            'password' => bcrypt('password'),
            'role' => $role,
            'contact_no' => $this->faker->phoneNumber(),
            'store_name' => $role === 'seller' ? $this->faker->company() : null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
