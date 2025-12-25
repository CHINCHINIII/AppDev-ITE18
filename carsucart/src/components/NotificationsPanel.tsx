import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Heart, ShoppingCart, Star, CheckCircle, TrendingUp } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { Button } from './ui/button';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { orders, markNotificationAsRead } = useOrders();

  const notifications = orders
    .filter(order => !order.notificationRead)
    .map(order => ({
      id: order.id,
      type: 'order',
      title: `Order ${order.status}`,
      message: `Your order #${order.id} has been ${order.status.toLowerCase()}`,
      time: new Date(order.date).toLocaleDateString(),
      icon: Package,
      color: 'text-blue-600 bg-blue-50'
    }));

  // Add some sample notifications
  const sampleNotifications = [
    {
      id: 'notif-1',
      type: 'wishlist',
      title: 'Price Drop Alert',
      message: 'iPhone 13 Pro is now 10% off!',
      time: '2 hours ago',
      icon: Heart,
      color: 'text-red-600 bg-red-50'
    },
    {
      id: 'notif-2',
      type: 'cart',
      title: 'Cart Reminder',
      message: 'You have items waiting in your cart',
      time: '5 hours ago',
      icon: ShoppingCart,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 'notif-3',
      type: 'review',
      title: 'Leave a Review',
      message: 'How was your recent purchase?',
      time: '1 day ago',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      id: 'notif-4',
      type: 'promo',
      title: 'Special Offer',
      message: 'Flash sale starts in 2 hours!',
      time: '2 days ago',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  const allNotifications = [...notifications, ...sampleNotifications];

  const handleMarkAllRead = () => {
    orders.forEach(order => {
      if (!order.notificationRead) {
        markNotificationAsRead(order.id);
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-[#333]">Notifications</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              {allNotifications.length > 0 && (
                <Button
                  onClick={handleMarkAllRead}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {allNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-[#333] mb-2">No notifications</h3>
                  <p className="text-gray-600 text-sm">
                    We'll notify you when something important happens
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {allNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (notification.type === 'order') {
                          markNotificationAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.color}`}>
                          <notification.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[#333] mb-1">
                            {notification.title}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="text-xs text-gray-500">
                            {notification.time}
                          </div>
                        </div>
                        {notification.type === 'order' && (
                          <div className="w-2 h-2 bg-[#00D084] rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
