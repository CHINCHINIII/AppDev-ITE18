<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\Order;
use App\Models\Cart;
use App\Models\Review;
use App\Models\Payment;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics for the authenticated user
     */
    public function stats()
    {
        $user = Auth::user();
        $stats = [];

        if ($user->role === 'admin') {
            $stats = $this->getAdminStats();
        } elseif ($user->role === 'seller') {
            $stats = $this->getSellerStats($user);
        } else {
            $stats = $this->getBuyerStats($user);
        }

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get admin dashboard statistics
     */
    private function getAdminStats()
    {
        $totalUsers = \App\Models\User::count();
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $totalOrders = Order::count();
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        
        $recentOrders = Order::with(['buyer', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $productCategories = Product::select('category_id', DB::raw('count(*) as count'))
            ->groupBy('category_id')
            ->with('category:id,name')
            ->get();

        $monthlyRevenue = Payment::where('status', 'completed')
            ->selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, SUM(amount) as revenue')
            ->groupBy('month', 'year')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

        return [
            'summary' => [
                'total_users' => $totalUsers,
                'total_products' => $totalProducts,
                'total_categories' => $totalCategories,
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
            ],
            'recent_orders' => $recentOrders,
            'product_by_category' => $productCategories,
            'monthly_revenue' => $monthlyRevenue
        ];
    }

    /**
     * Get seller dashboard statistics
     */
    private function getSellerStats($user)
    {
        $productsCount = Product::where('seller_id', $user->id)->count();
        $activeProducts = Product::where('seller_id', $user->id)
            ->where('is_active', true)
            ->count();
        
        $totalOrders = Order::whereHas('items', function($query) use ($user) {
                $query->whereHas('product', function($q) use ($user) {
                    $q->where('seller_id', $user->id);
                });
            })
            ->count();

        $totalSales = Order::whereHas('items', function($query) use ($user) {
                $query->whereHas('product', function($q) use ($user) {
                    $q->where('seller_id', $user->id);
                });
            })
            ->sum('total');

        $recentProducts = Product::where('seller_id', $user->id)
            ->with(['category', 'reviews'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $productSales = Product::where('seller_id', $user->id)
            ->withCount('orderItems')
            ->orderBy('order_items_count', 'desc')
            ->limit(10)
            ->get();

        return [
            'summary' => [
                'total_products' => $productsCount,
                'active_products' => $activeProducts,
                'total_orders' => $totalOrders,
                'total_sales' => $totalSales,
            ],
            'recent_products' => $recentProducts,
            'top_selling_products' => $productSales
        ];
    }

    /**
     * Get buyer dashboard statistics
     */
    private function getBuyerStats($user)
    {
        $cart = Cart::where('user_id', $user->id)->first();
        $cartItemsCount = $cart ? $cart->items()->count() : 0;
        $cartTotal = $cart ? $cart->items()->sum('subtotal') : 0;

        $ordersCount = Order::where('buyer_id', $user->id)->count();
        $totalSpent = Payment::whereHas('order', function($q) use ($user) {
                $q->where('buyer_id', $user->id);
            })
            ->where('status', 'completed')
            ->sum('amount');

        $recentOrders = Order::where('buyer_id', $user->id)
            ->with(['items.product', 'items.variant'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $myReviews = Review::where('user_id', $user->id)
            ->with('product')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return [
            'summary' => [
                'cart_items' => $cartItemsCount,
                'cart_total' => $cartTotal,
                'total_orders' => $ordersCount,
                'total_spent' => $totalSpent,
            ],
            'recent_orders' => $recentOrders,
            'my_reviews' => $myReviews
        ];
    }

    /**
     * Get monthly sales report (for sellers)
     */
    public function monthlyReport(Request $request)
    {
        $user = Auth::user();
        
        if ($user->role !== 'seller') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only sellers can access this resource.'
            ], 403);
        }

        $year = $request->get('year', now()->year);
        $month = $request->get('month', now()->month);

        $sales = Order::whereHas('items', function($query) use ($user) {
                $query->whereHas('product', function($q) use ($user) {
                    $q->where('seller_id', $user->id);
                });
            })
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->with(['items.product'])
            ->get();

        $totalRevenue = $sales->sum('total');
        $totalOrders = $sales->count();

        return response()->json([
            'success' => true,
            'data' => [
                'year' => $year,
                'month' => $month,
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'sales' => $sales
            ]
        ]);
    }

    /**
     * Get product performance analytics (for sellers)
     */
    public function productAnalytics()
    {
        $user = Auth::user();
        
        if ($user->role !== 'seller') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only sellers can access this resource.'
            ], 403);
        }

        $analytics = Product::where('seller_id', $user->id)
            ->withCount(['reviews', 'orderItems'])
            ->with(['category'])
            ->get()
            ->map(function($product) {
                return [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'category' => $product->category->name,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'is_active' => $product->is_active,
                    'total_reviews' => $product->reviews_count,
                    'total_sales' => $product->order_items_count,
                    'average_rating' => $product->reviews()->avg('rating') ?? 0
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $analytics
        ]);
    }
}
