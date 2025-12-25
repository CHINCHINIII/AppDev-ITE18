<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'admin') {
            return $this->adminDashboard();
        } elseif ($user->role === 'seller') {
            return $this->sellerDashboard();
        } else {
            return $this->buyerDashboard();
        }
    }

    private function adminDashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'total_categories' => Category::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'active_products' => Product::where('is_active', true)->count()
        ];

        $recentOrders = Order::with(['buyer', 'items.product'])
            ->latest()
            ->limit(5)
            ->get();

        $recentUsers = User::latest()->limit(5)->get();

        return view('web.admin.dashboard', compact('stats', 'recentOrders', 'recentUsers'));
    }

    private function sellerDashboard()
    {
        $user = Auth::user();
        
        $stats = [
            'total_products' => Product::where('seller_id', $user->id)->count(),
            'active_products' => Product::where('seller_id', $user->id)->where('is_active', true)->count(),
            'total_orders' => Order::whereHas('items.product', function($query) use ($user) {
                $query->where('seller_id', $user->id);
            })->count(),
            'pending_orders' => Order::whereHas('items.product', function($query) use ($user) {
                $query->where('seller_id', $user->id);
            })->where('status', 'pending')->count()
        ];

        $recentProducts = Product::where('seller_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();

        $recentOrders = Order::whereHas('items.product', function($query) use ($user) {
                $query->where('seller_id', $user->id);
            })
            ->with(['buyer', 'items.product'])
            ->latest()
            ->limit(5)
            ->get();

        return view('web.seller.dashboard', compact('stats', 'recentProducts', 'recentOrders'));
    }

    private function buyerDashboard()
    {
        $user = Auth::user();
        
        $stats = [
            'total_orders' => Order::where('buyer_id', $user->id)->count(),
            'pending_orders' => Order::where('buyer_id', $user->id)->where('status', 'pending')->count(),
            'completed_orders' => Order::where('buyer_id', $user->id)->where('status', 'delivered')->count()
        ];

        $recentOrders = Order::with(['items.product'])
            ->where('buyer_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();

        return view('web.buyer.dashboard', compact('stats', 'recentOrders'));
    }

    public function users()
    {
        $users = User::withCount(['products', 'orders'])
            ->latest()
            ->paginate(15);

        return view('web.admin.users.index', compact('users'));
    }
}
