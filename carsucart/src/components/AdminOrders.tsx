import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import api from '../lib/axios'; // Import API client
import {
  ShoppingCart,
  Search,
  Eye,
  ChevronLeft,
  Package,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { formatPeso } from '../lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]); // Initialize empty
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Backend expects role query param for admin access
      const response = await api.get('/admin/orders');
      
      if (response.data.success) {
        // Map backend data to component structure
        const mappedOrders = response.data.data.data.map((o: any) => ({
          id: o.id.toString(), // Keep as string for consistency
          customerName: o.buyer_name,
          customerEmail: o.buyer_email,
          date: new Date(o.created_at).toLocaleDateString(),
          total: Number(o.total),
          status: o.status.charAt(0).toUpperCase() + o.status.slice(1), // Capitalize
          items: o.items ? o.items.length : 0,
          address: o.delivery_method === 'pickup' 
            ? `Pickup: ${o.pickup_location || 'Campus Meet-up'}` 
            : o.delivery_address || 'No address provided',
          products: o.items ? o.items.map((i: any) => ({
            name: i.product ? i.product.name : 'Unknown Product',
            qty: i.qty,
            price: Number(i.price_at_purchase)
          })) : []
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setShowViewDialog(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      // API expects lowercase status
      const apiStatus = newStatus.toLowerCase();
      await api.put(`/orders/${orderId}/status`, { status: apiStatus });
      
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
      toast.success('Order status updated');
      
      // Optionally refresh to get latest update time/details
      // fetchOrders(); 
    } catch (error) {
      console.error('Update status failed:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-600';
      case 'Shipped': return 'bg-blue-50 text-blue-600';
      case 'Processing': return 'bg-yellow-50 text-yellow-600';
      case 'Pending': return 'bg-orange-50 text-orange-600';
      case 'Cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Processing': return <Package className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    revenue: orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/admin/dashboard')}
                variant="ghost"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-[#333]">Order Management</h1>
                <p className="text-sm text-gray-600">Manage all platform orders</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-2xl text-[#333]">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-2xl text-[#333]">{stats.pending + stats.processing}</div>
            <div className="text-sm text-gray-600">Pending/Processing</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl text-[#333]">{stats.delivered}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">₱</span>
            </div>
            <div className="text-2xl text-[#333]">{formatPeso(stats.revenue)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by order ID or customer name..."
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
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Order ID</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Customer</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Date</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Items</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Total</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-[#F8F8F8] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-[#333]">{order.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-[#333]">{order.customerName}</div>
                        <div className="text-sm text-gray-600">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.date}</td>
                    <td className="px-6 py-4 text-gray-600">{order.items} items</td>
                    <td className="px-6 py-4 text-[#333]">{formatPeso(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleView(order)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* View Order Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl text-[#333] mb-1">{selectedOrder.id}</div>
                  <div className="text-sm text-gray-600">Placed on {selectedOrder.date}</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F8F8F8] rounded-xl">
                <div>
                  <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer
                  </div>
                  <div className="text-[#333]">{selectedOrder.customerName}</div>
                  <div className="text-sm text-gray-600">{selectedOrder.customerEmail}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </div>
                  <div className="text-[#333]">{selectedOrder.address}</div>
                </div>
              </div>

              <div>
                <h4 className="text-[#333] mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.products.map((product: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#F8F8F8] rounded-lg">
                      <div className="flex-1">
                        <div className="text-[#333]">{product.name}</div>
                        <div className="text-sm text-gray-600">Qty: {product.qty}</div>
                      </div>
                      <div className="text-[#333]">{formatPeso(product.price * product.qty)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg text-[#333]">Total Amount</span>
                  <span className="text-2xl text-[#00D084]">{formatPeso(selectedOrder.total)}</span>
                </div>
                
                <div className="text-sm text-gray-500 italic text-center">
                  Order status management is handled by Sellers.
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
