@extends('web.layouts.app')

@section('title', $category->name)
@section('description', 'Frontend reset placeholder')

@section('content')
<h1>{{ $category->name }} (placeholder)</h1>
<p>Design removed. Listing products in plain text for now.</p>

@forelse($products as $product)
    <div style="margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #eee;">
        <div><strong>{{ $product->name }}</strong></div>
        <div>₱{{ number_format($product->price, 2) }} | {{ $product->brand }} | {{ $product->stock }} {{ $product->unit }}</div>
        <div>Seller: {{ $product->seller->name }}</div>
        <div>{{ Str::limit($product->description, 120) }}</div>
        <a href="{{ route('products.show', $product->id) }}">View details</a>
    </div>
@empty
    <p>No products found in this category.</p>
@endforelse

@if($products->hasPages())
    <div style="margin-top:12px;">
        {{ $products->links() }}
    </div>
@endif

<p style="margin-top:16px;">
    <a href="{{ route('categories.index') }}">Back to categories</a> | <a href="{{ route('products.index') }}">All products</a>
</p>
@endsection
