import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TrendingUp, Eye, ShoppingBag, Package, Plus, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { formatPeso } from '../lib/utils';
import api from '../lib/axios';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]); // Monthly data
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, analyticsRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/dashboard/product-analytics')
      ]);

      if (statsRes.data.success) {
        setStatsData(statsRes.data.data);
      }

      if (analyticsRes.data.success) {
         // Map for top products
         const products = analyticsRes.data.data
            .sort((a: any, b: any) => b.total_sales - a.total_sales)
            .slice(0, 5)
            .map((p: any) => ({
                name: p.product_name,
                sold: p.total_sales,
                revenue: p.total_sales * Number(p.price)
            }));
         setTopProducts(products);
      }
      
      // Mock sales graph data for now as backend endpoint for historical graph is complex
      setSalesData([
        { month: 'Jan', sales: 0 },
        { month: 'Feb', sales: 0 },
        { month: 'Mar', sales: 0 },
        { month: 'Apr', sales: 0 },
        { month: 'May', sales: 0 },
        { month: 'Jun', sales: statsData?.summary?.total_sales || 0 }, // Just show current total for latest month
      ]);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Total Sales',
      value: formatPeso(statsData?.summary?.total_sales || 0),
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      bgColor: 'bg-green-600'
    },
    {
      label: 'Total Products', // Views not tracked yet
      value: statsData?.summary?.total_products || '0',
      icon: Eye, // Reusing Eye icon but labeling as Products count
      color: 'bg-blue-50 text-blue-600',
      bgColor: 'bg-blue-600'
    },
    {
      label: 'Total Orders',
      value: statsData?.summary?.total_orders || '0',
      icon: ShoppingBag,
      color: 'bg-purple-50 text-purple-600',
      bgColor: 'bg-purple-600'
    },
    {
      label: 'Active Products',
      value: statsData?.summary?.active_products || '0',
      icon: Package,
      color: 'bg-orange-50 text-orange-600',
      bgColor: 'bg-orange-600'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#00966A] p-2 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#333]">Seller Dashboard</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/home')}
                className="bg-[#00D084] hover:bg-[#00966A] gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop as Buyer
              </Button>
              <Button
                onClick={() => navigate('/seller/products')}
                variant="outline"
                className="gap-2"
              >
                <Package className="w-4 h-4" />
                My Products
              </Button>
              <Button
                onClick={() => navigate('/seller/orders')}
                variant="outline"
                className="gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Orders
              </Button>
              <Button
                onClick={() => navigate('/home')}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-[#333] mb-2">Welcome back, Seller!</h1>
          <p className="text-gray-600">Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-[#00D084] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <motion.div
                  className={`w-2 h-2 ${stat.bgColor} rounded-full`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </div>
              <div className="text-2xl text-[#333] mb-1">{loading ? '...' : stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-[#333] mb-6">Sales Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => formatPeso(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#00D084"
                    strokeWidth={3}
                    dot={{ fill: '#00D084', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-[#00D084] to-[#00966A] rounded-2xl p-6 mt-6 text-white"
            >
              <h3 className="mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => navigate('/seller/product/new')}
                  className="bg-white text-[#00D084] hover:bg-white/90 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
                <Button
                  onClick={() => navigate('/seller/products')}
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  View Products
                </Button>
                <Button
                  onClick={() => navigate('/seller/orders')}
                  variant="outline"
                  className="col-span-2 border-white text-white hover:bg-white/10 gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Manage Orders
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-[#333] mb-6">Top Products</h3>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : topProducts.length === 0 ? (
                <div className="text-center text-gray-500">No sales yet</div>
              ) : (
              topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-[#00D084]/10 rounded-lg flex items-center justify-center text-[#00D084]">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#333] mb-1 truncate">{product.name}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{product.sold} sold</span>
                      <span>•</span>
                      <span className="text-[#00D084]">{formatPeso(product.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}