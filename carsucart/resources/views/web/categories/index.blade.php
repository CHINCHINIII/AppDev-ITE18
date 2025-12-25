@extends('web.layouts.app')

@section('title', 'Categories')
@section('description', 'Frontend reset placeholder')

@section('content')
<h1>Categories (placeholder)</h1>
<p>The styled category grid has been removed. Use the list below while we prepare the new design.</p>

@forelse($categories as $category)
    <div style="margin-bottom:12px;">
        <strong>{{ $category->name }}</strong> — {{ $category->products_count }} product(s)
        <div><a href="{{ route('categories.show', $category->id) }}">View products in this category</a></div>
    </div>
@empty
    <p>No categories available.</p>
@endforelse

<div style="margin-top:16px;">
    <a href="{{ route('products.index') }}">View all products</a> | <a href="{{ route('home') }}">Back to home</a>
</div>
@endsection
