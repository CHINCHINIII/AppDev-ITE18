import React, { useEffect, useState } from 'react';
import { fetchCartApi, createOrderApi, createPaymentApi } from '../api';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_pickup' | 'gcash'>('cash_on_pickup');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await fetchCartApi();
      if (res.data.success) {
        setCartItems(res.data.data.items);
        setTotal(res.data.data.total);
      }
    } catch (error) {
      console.error('Failed to load cart', error);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // 1. Create Order
      const orderRes = await createOrderApi({
        shipping_address: 'Campus Pickup', // simplified for now
        payment_method: paymentMethod, // purely informational at this stage for order
        notes: 'Meet up at Main Gate'
      });

      if (orderRes.data.success) {
        const orderId = orderRes.data.data.id;

        // 2. Create Payment
        const paymentRes = await createPaymentApi({
            order_id: orderId,
            method: paymentMethod,
            amount: total
        });

        if (paymentRes.data.success) {
            if (paymentMethod === 'gcash' && paymentRes.data.redirect_url) {
                // Redirect to mock GCash
                window.location.href = paymentRes.data.redirect_url;
            } else {
                alert('Order placed successfully! Please pay upon meet up.');
                navigate('/my-orders');
            }
        }
      }
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return <div className="p-8 text-center">Your cart is empty.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 border p-4 rounded bg-white">
                {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                    <span>Total</span>
                    <span>₱{total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div>
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-4">
                <div className={`p-4 border rounded cursor-pointer ${paymentMethod === 'cash_on_pickup' ? 'border-blue-600 bg-blue-50' : ''}`}
                     onClick={() => setPaymentMethod('cash_on_pickup')}>
                    <h3 className="font-bold">Meet Up (Cash on Pickup)</h3>
                    <p className="text-sm text-gray-600">Pay when you meet the seller on campus.</p>
                </div>

                <div className={`p-4 border rounded cursor-pointer ${paymentMethod === 'gcash' ? 'border-blue-600 bg-blue-50' : ''}`}
                     onClick={() => setPaymentMethod('gcash')}>
                    <h3 className="font-bold">GCash</h3>
                    <p className="text-sm text-gray-600">Pay securely via GCash.</p>
                </div>
            </div>

            <button 
                className="mt-8 w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
                onClick={handleCheckout}
                disabled={loading}
            >
                {loading ? 'Processing...' : `Pay ₱${total.toFixed(2)}`}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
