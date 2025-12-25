<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function profile()
    {
        $user = Auth::user();
        
        // Add additional stats based on role
        $stats = [
            'reviews_count' => $user->reviews()->count(),
        ];

        if ($user->role === 'buyer') {
            $stats['orders_count'] = $user->orders()->count();
        } elseif ($user->role === 'seller') {
            $stats['products_count'] = $user->products()->count();
            
            // Calculate sales and revenue from OrderItems linked to seller's products
            $sellerItems = \App\Models\OrderItem::whereHas('product', function($q) use ($user) {
                $q->where('seller_id', $user->id);
            });
            
            $stats['total_sales'] = $sellerItems->sum('qty');
            $stats['revenue'] = $sellerItems->sum('subtotal');
        }

        $userData = $user->toArray();
        $userData['stats'] = $stats;
        
        return response()->json([
            'success' => true,
            'data' => $userData
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'contact_no' => 'nullable|string|max:20',
            'store_name' => 'nullable|string|max:255',
            'current_password' => 'required_with:password',
            'password' => 'sometimes|string|min:8|confirmed',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify current password if changing password
        if ($request->has('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }
        }

        $updateData = $request->only(['name', 'email', 'contact_no', 'store_name']);
        
        if ($request->has('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        // Handle profile photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists and is not a default/external URL
            if ($user->profile_photo_path && file_exists(public_path($user->profile_photo_path))) {
                @unlink(public_path($user->profile_photo_path));
            }

            $photo = $request->file('photo');
            $photoName = 'profile_' . time() . '.' . $photo->extension();
            $photo->move(public_path('profile-photos'), $photoName);
            $updateData['profile_photo_path'] = '/profile-photos/' . $photoName;
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user->fresh()
        ]);
    }

    public function index(Request $request)
    {
        $query = User::query();

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $users = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }
}
