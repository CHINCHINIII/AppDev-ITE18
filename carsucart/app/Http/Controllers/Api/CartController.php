<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cart = Cart::with(['items.product', 'items.variant'])
            ->where('user_id', $user->id)
            ->first();

        if (!$cart) {
            $cart = Cart::create(['user_id' => $user->id]);
            $cart->load(['items.product', 'items.variant']);
        }

        $total = $cart->items->sum('subtotal');

        return response()->json([
            'success' => true,
            'data' => [
                'cart' => $cart,
                'total' => $total,
                'item_count' => $cart->items->count()
            ]
        ]);
    }

    public function addItem(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'qty' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::find($request->product_id);

        if (!$product->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Product is not available'
            ], 422);
        }

        if ($product->stock < $request->qty) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock'
            ], 422);
        }

        // Check if variant is provided and belongs to the product
        if ($request->variant_id) {
            $variant = ProductVariant::where('id', $request->variant_id)
                ->where('product_id', $request->product_id)
                ->first();
            
            if (!$variant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid product variant'
                ], 422);
            }
        }

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            $cart = Cart::create(['user_id' => $user->id]);
        }

        // Check if item already exists in cart
        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->where('variant_id', $request->variant_id)
            ->first();

        if ($existingItem) {
            $newQty = $existingItem->qty + $request->qty;
            
            if ($product->stock < $newQty) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock for the requested quantity'
                ], 422);
            }

            $existingItem->update([
                'qty' => $newQty,
                'subtotal' => $newQty * $existingItem->price_at_add
            ]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'variant_id' => $request->variant_id,
                'qty' => $request->qty,
                'price_at_add' => $product->price,
                'subtotal' => $request->qty * $product->price,
                'added_at' => now()
            ]);
        }

        $cart->load(['items.product', 'items.variant']);
        $total = $cart->items->sum('subtotal');

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart successfully',
            'data' => [
                'cart' => $cart,
                'total' => $total
            ]
        ]);
    }

    public function updateItem(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'qty' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            return response()->json([
                'success' => false,
                'message' => 'Cart not found'
            ], 404);
        }

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('id', $id)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found'
            ], 404);
        }

        $product = Product::find($cartItem->product_id);

        if ($product->stock < $request->qty) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock'
            ], 422);
        }

        $cartItem->update([
            'qty' => $request->qty,
            'subtotal' => $request->qty * $cartItem->price_at_add
        ]);

        $cart->load(['items.product', 'items.variant']);
        $total = $cart->items->sum('subtotal');

        return response()->json([
            'success' => true,
            'message' => 'Cart item updated successfully',
            'data' => [
                'cart' => $cart,
                'total' => $total
            ]
        ]);
    }

    public function removeItem($id)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            return response()->json([
                'success' => false,
                'message' => 'Cart not found'
            ], 404);
        }

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('id', $id)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found'
            ], 404);
        }

        $cartItem->delete();

        $cart->load(['items.product', 'items.variant']);
        $total = $cart->items->sum('subtotal');

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart successfully',
            'data' => [
                'cart' => $cart,
                'total' => $total
            ]
        ]);
    }

    public function clear()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            return response()->json([
                'success' => false,
                'message' => 'Cart not found'
            ], 404);
        }

        $cart->items()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully',
            'data' => [
                'cart' => $cart->fresh(['items.product', 'items.variant']),
                'total' => 0
            ]
        ]);
    }
}
