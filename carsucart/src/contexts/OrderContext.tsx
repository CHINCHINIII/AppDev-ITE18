import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/axios';
import { toast } from 'sonner';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'shipping' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  deliveryMethod: 'meet-up' | 'delivery';
  paymentMethod: string;
  status: OrderStatus;
  deliveryAddress: {
    name: string;
    phone: string;
    building?: string;
    room?: string;
    notes?: string;
  };
  orderDate: Date;
  estimatedDelivery?: Date;
  sellerId?: string;
  sellerName?: string;
  trackingUpdates: {
    status: OrderStatus;
    message: string;
    timestamp: Date;
  }[];
}

interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: any) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, message: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: () => Order[];
  unreadNotifications: number;
  markNotificationsAsRead: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastReadTime, setLastReadTime] = useState<Date>(new Date());
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        const mappedOrders = response.data.data.data.map((o: any) => ({
          id: o.id.toString(),
          items: o.items.map((i: any) => ({
            id: i.product_id,
            name: i.product ? i.product.name : 'Product',
            price: Number(i.price_at_purchase),
            image: `https://placehold.co/600x400?text=${encodeURIComponent(i.product ? i.product.name : 'Product')}`,
            quantity: i.qty,
            variant: i.variant ? i.variant.value : undefined
          })),
          totalAmount: Number(o.total),
          shippingFee: o.delivery_method === 'delivery' ? 50 : 0,
          deliveryMethod: o.delivery_method === 'pickup' ? 'meet-up' : 'delivery',
          paymentMethod: 'cod', // Default or fetch if available
          status: o.status,
          deliveryAddress: {
            name: user?.name || '',
            phone: user?.phone || '',
            notes: o.delivery_address || o.pickup_location // Use whatever contains the address info
          },
          orderDate: new Date(o.created_at),
          trackingUpdates: [
            {
              status: o.status,
              message: `Order is ${o.status}`,
              timestamp: new Date(o.updated_at)
            }
          ]
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const addOrder = async (orderData: any) => {
    try {
      // orderData contains delivery info. Backend fetches items from cart.
      // Map frontend data to backend expectation
      const payload = {
        delivery_method: orderData.deliveryMethod === 'meet-up' ? 'pickup' : 'delivery',
        pickup_location: orderData.deliveryMethod === 'meet-up' ? 'Campus Meet-up' : null,
        delivery_address: orderData.deliveryMethod === 'delivery' 
          ? `[${orderData.deliveryAddress.name} - ${orderData.deliveryAddress.phone}] ${orderData.deliveryAddress.building}, ${orderData.deliveryAddress.room}. ${orderData.deliveryAddress.notes}`
          : null
      };

      await api.post('/orders', payload);
      await fetchOrders();
      toast.success('Order placed successfully!');
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, message: string) => {
    try {
        await api.put(`/orders/${orderId}/status`, { status });
        await fetchOrders();
        toast.success('Order status updated');
    } catch (error) {
        console.error('Failed to update status:', error);
        toast.error('Failed to update order status');
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getUserOrders = () => {
    return orders;
  };

  const unreadNotifications = orders.reduce((count, order) => {
    const latestUpdate = order.trackingUpdates[order.trackingUpdates.length - 1];
    return latestUpdate.timestamp > lastReadTime ? count + 1 : count;
  }, 0);

  const markNotificationsAsRead = () => {
    setLastReadTime(new Date());
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getOrderById,
      getUserOrders,
      unreadNotifications,
      markNotificationsAsRead
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
