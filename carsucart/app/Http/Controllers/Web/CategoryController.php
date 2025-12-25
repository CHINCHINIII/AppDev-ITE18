<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')
            ->having('products_count', '>', 0)
            ->get();

        return view('web.categories.index', compact('categories'));
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        
        $products = Product::with(['category', 'seller', 'variants'])
            ->where('category_id', $id)
            ->where('is_active', true)
            ->paginate(12);

        return view('web.categories.show', compact('category', 'products'));
    }

    public function adminIndex()
    {
        $categories = Category::withCount('products')->get();
        return view('web.admin.categories.index', compact('categories'));
    }

    public function create()
    {
        return view('web.admin.categories.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories'
        ]);

        Category::create([
            'name' => $request->name
        ]);

        return redirect()->route('admin.categories')
            ->with('success', 'Category created successfully!');
    }

    public function edit($id)
    {
        $category = Category::findOrFail($id);
        return view('web.admin.categories.edit', compact('category'));
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id
        ]);

        $category->update([
            'name' => $request->name
        ]);

        return redirect()->route('admin.categories')
            ->with('success', 'Category updated successfully!');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Check if category has products
        if ($category->products()->count() > 0) {
            return redirect()->route('admin.categories')
                ->with('error', 'Cannot delete category that has products!');
        }

        $category->delete();

        return redirect()->route('admin.categories')
            ->with('success', 'Category deleted successfully!');
    }
}
