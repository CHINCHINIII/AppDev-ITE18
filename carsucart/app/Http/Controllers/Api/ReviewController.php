<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Get all reviews for a specific product
     */
    public function index(Request $request)
    {
        $query = Review::with(['user', 'product']);

        // Filter by product
        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by rating
        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }

        // Get ratings above a certain value
        if ($request->has('min_rating')) {
            $query->where('rating', '>=', $request->min_rating);
        }

        $perPage = $request->get('per_page', 15);
        $reviews = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    /**
     * Get a specific review
     */
    public function show($id)
    {
        $review = Review::with(['user', 'product'])->find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $review
        ]);
    }

    /**
     * Create a new review
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();

        // Check if product exists
        $product = Product::find($request->product_id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // Check if user already reviewed this product
        $existingReview = Review::where('product_id', $request->product_id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this product'
            ], 422);
        }

        // Purchase check removed to allow all users to review

        $review = Review::create([
            'product_id' => $request->product_id,
            'user_id' => $user->id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        $review->load(['user', 'product']);

        return response()->json([
            'success' => true,
            'message' => 'Review created successfully',
            'data' => $review
        ], 201);
    }

    /**
     * Update a review
     */
    public function update(Request $request, $id)
    {
        $review = Review::where('user_id', Auth::id())->find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found or you do not have permission to update it'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $review->update($request->only(['rating', 'comment']));

        $review->load(['user', 'product']);

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully',
            'data' => $review
        ]);
    }

    /**
     * Delete a review
     */
    public function destroy($id)
    {
        $review = Review::where('user_id', Auth::id())->find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found or you do not have permission to delete it'
            ], 404);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully'
        ]);
    }

    /**
     * Get product rating statistics
     */
    public function productStats($productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $stats = [
            'total_reviews' => $product->reviews()->count(),
            'average_rating' => $product->reviews()->avg('rating') ?? 0,
            'rating_distribution' => [
                1 => $product->reviews()->where('rating', 1)->count(),
                2 => $product->reviews()->where('rating', 2)->count(),
                3 => $product->reviews()->where('rating', 3)->count(),
                4 => $product->reviews()->where('rating', 4)->count(),
                5 => $product->reviews()->where('rating', 5)->count(),
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
