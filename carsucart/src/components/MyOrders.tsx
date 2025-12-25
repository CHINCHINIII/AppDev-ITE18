import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Package,
  ChevronLeft,
  Search,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  RefreshCw,
  MessageCircle,
  Star
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useOrders, Order } from '../contexts/OrderContext';
import { formatPeso } from '../lib/utils';
import { toast } from 'sonner';
import api from '../lib/axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

export default function MyOrders() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Review State
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewItem, setReviewItem] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-50 text-green-600';
      case 'shipped': return 'bg-blue-50 text-blue-600';
      case 'processing': return 'bg-yellow-50 text-yellow-600';
      case 'pending': return 'bg-orange-50 text-orange-600';
      case 'cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const handleWriteReview = (item: any) => {
    setReviewItem(item);
    setRating(5);
    setComment('');
    setShowReviewDialog(true);
  };

  const submitReview = async () => {
    if (!reviewItem) return;
    try {
        setSubmittingReview(true);
        await api.post('/reviews', {
            product_id: reviewItem.id,
            rating,
            comment
        });
        toast.success('Review submitted successfully!');
        setShowReviewDialog(false);
    } catch (error: any) {
        console.error('Failed to submit review:', error);
        toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
        setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/profile')}
              variant="ghost"
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-[#333]">My Orders</h1>
              <p className="text-sm text-gray-600">Track and manage your orders</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084]"
            >
              <option value="All">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-[#333] mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Button
              onClick={() => navigate('/home')}
              className="bg-[#00D084] hover:bg-[#00966A]"
            >
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-[#333] mb-1">Order {order.id}</div>
                    <div className="text-sm text-gray-600">Placed on {order.orderDate.toLocaleDateString()}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="text-[#333]">{item.name}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-[#333]">{formatPeso(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-[#333]">
                    Total: <span className="text-xl text-[#00D084]">{formatPeso(order.totalAmount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleViewDetails(order)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <Button
                        onClick={() => handleViewDetails(order)}
                        size="sm"
                        className="gap-2 bg-[#00D084] hover:bg-[#00966A]"
                      >
                        <Truck className="w-4 h-4" />
                        Track Order
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl text-[#333] mb-1">Order {selectedOrder.id}</div>
                  <div className="text-sm text-gray-600">Placed on {selectedOrder.orderDate.toLocaleDateString()}</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </span>
              </div>

              {/* Order Timeline */}
              <div className="bg-[#F8F8F8] rounded-xl p-6">
                <h4 className="text-[#333] mb-4">Order Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-[#333]">Order Placed</div>
                      <div className="text-sm text-gray-600">{selectedOrder.orderDate.toLocaleDateString()}</div>
                    </div>
                  </div>
                  {/* Mock timeline for now */}
                  {['Processing', 'Shipped', 'Delivered'].includes(selectedOrder.status) && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-[#333]">Processing</div>
                        <div className="text-sm text-gray-600">Your order is being prepared</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-[#333] mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-[#F8F8F8] rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="text-[#333]">{item.name}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#333] mb-2">{formatPeso(item.price * item.quantity)}</div>
                        {(selectedOrder.status === 'Delivered' || selectedOrder.status === 'Completed') && (
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleWriteReview(item)}
                                className="text-xs h-8"
                            >
                                Write Review
                            </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg text-[#333]">Total Amount</span>
                  <span className="text-2xl text-[#00D084]">{formatPeso(selectedOrder.totalAmount)}</span>
                </div>

                <div className="flex gap-2">
                  {selectedOrder.status === 'Delivered' && (
                    <Button className="flex-1 gap-2 bg-[#00D084] hover:bg-[#00966A]">
                      <RefreshCw className="w-4 h-4" />
                      Order Again
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1 gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contact Seller
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            {reviewItem && (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img src={reviewItem.image} alt={reviewItem.name} className="w-12 h-12 rounded object-cover" />
                        <div>
                            <div className="font-medium">{reviewItem.name}</div>
                            <div className="text-sm text-gray-500">How would you rate this product?</div>
                        </div>
                    </div>
                    
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="p-1 hover:scale-110 transition-transform"
                            >
                                <Star 
                                    className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084] min-h-[100px]"
                        placeholder="Share your thoughts about the product..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowReviewDialog(false)}>Cancel</Button>
                <Button 
                    className="bg-[#00D084] hover:bg-[#00966A]" 
                    onClick={submitReview}
                    disabled={submittingReview}
                >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
