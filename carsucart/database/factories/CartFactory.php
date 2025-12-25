<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartFactory extends Factory
{
    protected $model = Cart::class;

    public function definition()
    {
        // Get all user IDs that don't already have a cart
        $existingCartUserIds = Cart::pluck('user_id')->toArray();
        $availableUserIds = User::whereNotIn('id', $existingCartUserIds)->pluck('id')->toArray();
        
        // If no available users, create a new user
        if (empty($availableUserIds)) {
            $userId = User::factory()->create()->id;
        } else {
            $userId = $this->faker->randomElement($availableUserIds);
        }

        return [
            'user_id' => $userId,
        ];
    }
}
