<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Get all payments for the authenticated user's orders
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Payment::with(['order.buyer'])
            ->whereHas('order', function($q) use ($user) {
                $q->where('buyer_id', $user->id);
            });

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by method
        if ($request->has('method')) {
            $query->where('method', $request->method);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $perPage = $request->get('per_page', 15);
        $payments = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    /**
     * Get a specific payment
     */
    public function show($id)
    {
        $user = Auth::user();
        $payment = Payment::with(['order.buyer', 'order.items.product'])
            ->whereHas('order', function($q) use ($user) {
                $q->where('buyer_id', $user->id);
            })
            ->find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $payment
        ]);
    }

    /**
     * Create a new payment
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'method' => 'required|in:cash_on_pickup,gcash',
            'amount' => 'required|numeric|min:0',
            'status' => 'sometimes|in:pending,completed,failed,refunded'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        // Get the order
        $order = Order::find($request->order_id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Check if user owns the order
        if ($order->buyer_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. This order does not belong to you.'
            ], 403);
        }

        // Check if order already has a payment
        $existingPayment = Payment::where('order_id', $request->order_id)->first();
        if ($existingPayment) {
            return response()->json([
                'success' => false,
                'message' => 'This order already has a payment'
            ], 422);
        }

        // Validate amount
        if ($request->amount > $order->total) {
            return response()->json([
                'success' => false,
                'message' => 'Payment amount cannot exceed order total'
            ], 422);
        }

        $payment = Payment::create([
            'order_id' => $request->order_id,
            'method' => $request->method,
            'amount' => $request->amount,
            'status' => $request->get('status', 'pending'),
            'paid_at' => $request->get('status') === 'completed' ? now() : null
        ]);

        // If payment is completed, update order status
        if ($payment->status === 'completed') {
            DB::transaction(function() use ($order) {
                $order->update(['status' => 'confirmed']);
            });
        }

        // Mock GCash Redirect
        $redirectUrl = null;
        if ($request->method === 'gcash') {
            // In a real app, this would be the URL from the payment gateway
            $redirectUrl = 'https://m.gcash.com/payment-page-mock?amount=' . $payment->amount . '&ref=' . $payment->id;
        }

        $payment->load(['order.buyer', 'order.items.product']);

        return response()->json([
            'success' => true,
            'message' => 'Payment created successfully',
            'data' => $payment,
            'redirect_url' => $redirectUrl
        ], 201);
    }

    /**
     * Update payment status
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        $payment = Payment::with('order')
            ->whereHas('order', function($q) use ($user) {
                $q->where('buyer_id', $user->id);
            })
            ->find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found or you do not have permission to update it'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,completed,failed,refunded',
            'amount' => 'sometimes|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $payment->update([
            'status' => $request->status,
            'amount' => $request->has('amount') ? $request->amount : $payment->amount,
            'paid_at' => $request->status === 'completed' ? now() : $payment->paid_at
        ]);

        // Update order status based on payment status
        if ($request->status === 'completed' && $payment->order->status === 'pending') {
            $payment->order->update(['status' => 'confirmed']);
        } elseif ($request->status === 'failed' && $payment->order->status === 'confirmed') {
            $payment->order->update(['status' => 'pending']);
        }

        $payment->load(['order.buyer', 'order.items.product']);

        return response()->json([
            'success' => true,
            'message' => 'Payment updated successfully',
            'data' => $payment
        ]);
    }

    /**
     * Delete a payment
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        $payment = Payment::whereHas('order', function($q) use ($user) {
                $q->where('buyer_id', $user->id);
            })
            ->find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found or you do not have permission to delete it'
            ], 404);
        }

        // Only allow deletion if status is pending
        if ($payment->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete payment that is not pending'
            ], 422);
        }

        $payment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Payment deleted successfully'
        ]);
    }

    /**
     * Get payment summary/stats for the user
     */
    public function stats()
    {
        $user = Auth::user();
        
        $stats = Payment::whereHas('order', function($q) use ($user) {
                $q->where('buyer_id', $user->id);
            })
            ->selectRaw('
                COUNT(*) as total_payments,
                SUM(amount) as total_amount,
                AVG(amount) as average_amount,
                COUNT(CASE WHEN status = "completed" THEN 1 END) as completed_payments,
                COUNT(CASE WHEN status = "pending" THEN 1 END) as pending_payments,
                COUNT(CASE WHEN status = "failed" THEN 1 END) as failed_payments
            ')
            ->first();

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
