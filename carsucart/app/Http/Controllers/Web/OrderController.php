<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items.product', 'items.variant'])
            ->where('buyer_id', Auth::id())
            ->latest()
            ->paginate(10);

        return view('web.orders.index', compact('orders'));
    }

    public function show($id)
    {
        $order = Order::with(['items.product', 'items.variant', 'buyer'])
            ->where('buyer_id', Auth::id())
            ->findOrFail($id);

        return view('web.orders.show', compact('order'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'delivery_method' => 'required|in:pickup,courier',
            'pickup_location' => 'required|string|max:255'
        ]);

        $cart = Cart::with(['items.product', 'items.variant'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty!');
        }

        // Calculate total
        $total = $cart->items->sum('subtotal');

        // Create order
        $order = Order::create([
            'buyer_id' => Auth::id(),
            'cart_id' => $cart->id,
            'status' => 'pending',
            'total' => $total,
            'delivery_method' => $request->delivery_method,
            'pickup_location' => $request->pickup_location
        ]);

        // Create order items
        foreach ($cart->items as $cartItem) {
            $order->items()->create([
                'product_id' => $cartItem->product_id,
                'variant_id' => $cartItem->variant_id,
                'qty' => $cartItem->qty,
                'price_at_purchase' => $cartItem->price_at_add,
                'subtotal' => $cartItem->subtotal
            ]);
        }

        // Clear cart
        $cart->items()->delete();

        return redirect()->route('orders.show', $order->id)
            ->with('success', 'Order placed successfully!');
    }

    public function adminIndex()
    {
        $orders = Order::with(['items.product', 'buyer'])
            ->latest()
            ->paginate(15);

        return view('web.admin.orders.index', compact('orders'));
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return redirect()->route('admin.orders')
            ->with('success', 'Order status updated successfully!');
    }
}
