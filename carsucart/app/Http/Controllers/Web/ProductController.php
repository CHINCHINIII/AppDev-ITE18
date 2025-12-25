<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'seller', 'variants'])
            ->where('is_active', true);

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search by name or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if (in_array($sortBy, ['name', 'price', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $products = $query->paginate(12);
        $categories = Category::withCount('products')->get();

        return view('web.products.index', compact('products', 'categories'));
    }

    public function show($id)
    {
        $product = Product::with(['category', 'seller', 'variants', 'reviews.user'])
            ->where('is_active', true)
            ->findOrFail($id);

        // Get related products from the same category
        $relatedProducts = Product::with(['category', 'seller'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->limit(4)
            ->get();

        return view('web.products.show', compact('product', 'relatedProducts'));
    }

    public function myProducts(Request $request)
    {
        $query = Product::with(['category', 'variants', 'reviews'])
            ->where('seller_id', Auth::id());

        // Filter by status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate(15);

        return view('web.seller.products.index', compact('products'));
    }

    public function create()
    {
        $categories = Category::all();
        return view('web.seller.products.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sku' => 'required|string|max:100|unique:products',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'brand' => 'required|string|max:100',
            'is_active' => 'boolean'
        ]);

        $product = Product::create([
            'seller_id' => Auth::id(),
            'category_id' => $request->category_id,
            'sku' => $request->sku,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'unit' => $request->unit,
            'brand' => $request->brand,
            'is_active' => $request->get('is_active', true),
            'added_week' => now()->week,
            'added_month' => now()->month,
            'added_year' => now()->year
        ]);

        return redirect()->route('seller.products')
            ->with('success', 'Product created successfully!');
    }

    public function edit($id)
    {
        $product = Product::where('seller_id', Auth::id())->findOrFail($id);
        $categories = Category::all();
        
        return view('web.seller.products.edit', compact('product', 'categories'));
    }

    public function update(Request $request, $id)
    {
        $product = Product::where('seller_id', Auth::id())->findOrFail($id);

        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sku' => 'required|string|max:100|unique:products,sku,' . $id,
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'brand' => 'required|string|max:100',
            'is_active' => 'boolean'
        ]);

        $product->update($request->only([
            'category_id', 'sku', 'name', 'description', 'price', 
            'stock', 'unit', 'brand', 'is_active'
        ]));

        return redirect()->route('seller.products')
            ->with('success', 'Product updated successfully!');
    }

    public function destroy($id)
    {
        $product = Product::where('seller_id', Auth::id())->findOrFail($id);
        $product->delete();

        return redirect()->route('seller.products')
            ->with('success', 'Product deleted successfully!');
    }
}
