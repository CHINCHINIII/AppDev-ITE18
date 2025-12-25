@extends('web.layouts.app')

@section('title', 'Dashboard')
@section('description', 'Frontend reset placeholder')

@section('content')
<h1>Dashboard (placeholder)</h1>
<p>Design removed. Basic stats and recent orders are shown plainly.</p>

<div style="margin-bottom:12px;">
    <div>Total orders: {{ $stats['total_orders'] }}</div>
    <div>Pending orders: {{ $stats['pending_orders'] }}</div>
    <div>Completed orders: {{ $stats['completed_orders'] }}</div>
</div>

<h3>Recent orders</h3>
@forelse($recentOrders as $order)
    <div style="margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #eee;">
        <div>Order #{{ $order->id }} — {{ $order->created_at->format('M d, Y') }}</div>
        <div>Status: {{ ucfirst($order->status) }}</div>
        <div>Total: ₱{{ number_format($order->total, 2) }}</div>
    </div>
@empty
    <p>No orders yet. <a href="{{ route('products.index') }}">Start shopping</a></p>
@endforelse
@endsection
