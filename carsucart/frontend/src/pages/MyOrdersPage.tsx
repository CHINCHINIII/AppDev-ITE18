import React, { useEffect, useState } from 'react';
import { fetchOrdersApi } from '../api';
import type { Order } from '../types';
import ReviewModal from '../components/ReviewModal';
import OrderTrackingModal from '../components/OrderTrackingModal';
import MessagingModal from '../components/MessagingModal';

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchOrdersApi().then((res) => setOrders(res.data?.data ?? res.data ?? []));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Order #{order.orderNumber ?? order.id}</div>
                <div className="text-sm text-gray-500">{order.status}</div>
              </div>
              <div className="text-primary font-semibold">₱{order.total.toLocaleString()}</div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {order.items.map((i) => i.name).join(', ')}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <button className="btn-primary" onClick={() => { setActiveOrder(order); setShowTrack(true); }}>
                Track Order
              </button>
              <button className="btn-ghost" onClick={() => { setActiveOrder(order); setShowReview(true); }}>
                Leave Review
              </button>
              <button className="btn-ghost" onClick={() => { setActiveOrder(order); setShowChat(true); }}>
                Contact Seller
              </button>
            </div>
          </div>
        ))}
        {!orders.length && <div className="text-sm text-gray-500">No orders yet.</div>}
      </div>

      <ReviewModal
        open={showReview}
        onClose={() => setShowReview(false)}
        onSubmit={(payload) => {
          console.log('review', payload, activeOrder?.id);
        }}
      />
      <OrderTrackingModal
        open={showTrack}
        onClose={() => setShowTrack(false)}
        trackingNumber={activeOrder?.trackingNumber}
        steps={[
          { label: 'Order Placed', done: true },
          { label: 'Payment Confirmed', done: true },
          { label: 'Processing', done: activeOrder?.status !== 'pending' },
          { label: 'Out for Delivery', done: activeOrder?.status === 'delivered' },
          { label: 'Delivered', done: activeOrder?.status === 'delivered' },
        ]}
        eta={activeOrder?.estimatedDelivery}
      />
      <MessagingModal open={showChat} onClose={() => setShowChat(false)} counterpartName="Seller" />
    </div>
  );
};

export default MyOrdersPage;

