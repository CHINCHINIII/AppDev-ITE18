<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Order::with(['items.product', 'items.variant', 'payments'])
            ->where('buyer_id', $user->id);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $perPage = $request->get('per_page', 15);
        $orders = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'delivery_method' => 'required|in:pickup,delivery',
            'pickup_location' => 'required_if:delivery_method,pickup|nullable|string|max:255',
            'delivery_address' => 'required_if:delivery_method,delivery|nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $cart = Cart::with(['items.product', 'items.variant'])
            ->where('user_id', $user->id)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty'
            ], 422);
        }

        // Validate stock availability
        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->qty) {
                return response()->json([
                    'success' => false,
                    'message' => "Insufficient stock for product: {$item->product->name}"
                ], 422);
            }
        }

        DB::beginTransaction();

        try {
            // Calculate total
            $total = $cart->items->sum('subtotal');
            // Add shipping fee if delivery
            if ($request->delivery_method === 'delivery') {
                $total += 50; // Standard shipping fee
            }

            // Create order
            $order = Order::create([
                'buyer_id' => $user->id,
                'cart_id' => $cart->id,
                'status' => 'pending',
                'total' => $total,
                'delivery_method' => $request->delivery_method,
                'pickup_location' => $request->pickup_location,
                'delivery_address' => $request->delivery_address
            ]);

            // Create order items and update stock
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'qty' => $item->qty,
                    'price_at_purchase' => $item->price_at_add,
                    'subtotal' => $item->subtotal
                ]);

                // Update product stock
                $product = Product::find($item->product_id);
                $product->decrement('stock', $item->qty);
            }

            // Clear cart
            $cart->items()->delete();

            DB::commit();

            $order->load(['items.product', 'items.variant', 'payments']);

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $user = Auth::user();
        $order = Order::with(['items.product', 'items.variant', 'payments', 'buyer'])
            ->where('buyer_id', $user->id)
            ->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,paid,processing,shipped,delivered,completed,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $order = Order::where('buyer_id', $user->id)->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Only allow certain status changes
        $allowedStatuses = ['cancelled'];
        if ($order->status === 'pending' && in_array($request->status, $allowedStatuses)) {
            $order->update(['status' => $request->status]);
            
            // If cancelled, restore stock
            if ($request->status === 'cancelled') {
                foreach ($order->items as $item) {
                    $product = Product::find($item->product_id);
                    $product->increment('stock', $item->qty);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'data' => $order->fresh(['items.product', 'items.variant'])
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Status update not allowed'
        ], 422);
    }

    public function sellerIndex(Request $request)
    {
        $user = Auth::user();
        
        $query = Order::whereHas('items.product', function($q) use ($user) {
            $q->where('seller_id', $user->id);
        })->with(['items.product', 'items.variant', 'buyer', 'payments']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $perPage = $request->get('per_page', 15);
        $orders = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    public function sellerUpdateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,paid,processing,shipped,delivered,completed,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        // Verify seller has items in this order
        $order = Order::whereHas('items.product', function($q) use ($user) {
            $q->where('seller_id', $user->id);
        })->with('items')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found or access denied'
            ], 404);
        }

        $order->update(['status' => $request->status]);

        // If cancelled, restore stock
        if ($request->status === 'cancelled') {
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->increment('stock', $item->qty);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data' => $order
        ]);
    }

    public function adminIndex(Request $request)
    {
        $query = Order::with(['items.product', 'items.variant', 'buyer', 'payments']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by buyer
        if ($request->has('buyer_id')) {
            $query->where('buyer_id', $request->buyer_id);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $perPage = $request->get('per_page', 15);
        $orders = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }
}
