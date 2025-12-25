<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::with(['items.product', 'items.variant'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$cart) {
            $cart = Cart::create(['user_id' => Auth::id()]);
        }

        return view('web.cart.index', compact('cart'));
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'qty' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($request->product_id);
        
        // Get or create cart
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

        // Calculate price
        $variant = $request->variant_id ? $product->variants()->find($request->variant_id) : null;
        $price = $product->price + ($variant ? $variant->extra_price : 0);
        $qty = $request->qty;
        $subtotal = $price * $qty;

        // Check if item already exists in cart
        $existingItem = $cart->items()
            ->where('product_id', $request->product_id)
            ->where('variant_id', $request->variant_id)
            ->first();

        if ($existingItem) {
            $existingItem->update([
                'qty' => $existingItem->qty + $qty,
                'subtotal' => $existingItem->subtotal + $subtotal
            ]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'variant_id' => $request->variant_id,
                'qty' => $qty,
                'price_at_add' => $price,
                'subtotal' => $subtotal,
                'added_at' => now()
            ]);
        }

        return redirect()->route('cart.index')
            ->with('success', 'Item added to cart successfully!');
    }

    public function updateItem(Request $request, $id)
    {
        $request->validate([
            'qty' => 'required|integer|min:1'
        ]);

        $item = CartItem::whereHas('cart', function($query) {
            $query->where('user_id', Auth::id());
        })->findOrFail($id);

        $newQty = $request->qty;
        $newSubtotal = $item->price_at_add * $newQty;

        $item->update([
            'qty' => $newQty,
            'subtotal' => $newSubtotal
        ]);

        return redirect()->route('cart.index')
            ->with('success', 'Cart updated successfully!');
    }

    public function removeItem($id)
    {
        $item = CartItem::whereHas('cart', function($query) {
            $query->where('user_id', Auth::id());
        })->findOrFail($id);

        $item->delete();

        return redirect()->route('cart.index')
            ->with('success', 'Item removed from cart successfully!');
    }

    public function clear()
    {
        $cart = Cart::where('user_id', Auth::id())->first();
        
        if ($cart) {
            $cart->items()->delete();
        }

        return redirect()->route('cart.index')
            ->with('success', 'Cart cleared successfully!');
    }
}
