import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Shield,
  Users,
  Store,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import { formatPeso } from '../lib/utils';
import api from '../lib/axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Parallel fetch for stats and users
      const [statsRes, usersRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/admin/users?per_page=5')
      ]);

      if (statsRes.data.success) {
        setStatsData(statsRes.data.data);
      }

      if (usersRes.data.success) {
         const mappedUsers = usersRes.data.data.data.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
            status: 'Active'
         }));
         setRecentUsers(mappedUsers);
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const activityData = [
    { day: 'Mon', users: 120, orders: 45 },
    { day: 'Tue', users: 150, orders: 52 },
    { day: 'Wed', users: 180, orders: 68 },
    { day: 'Thu', users: 160, orders: 55 },
    { day: 'Fri', users: 200, orders: 75 },
    { day: 'Sat', users: 140, orders: 48 },
    { day: 'Sun', users: 100, orders: 35 },
  ];

  const stats = [
    {
      label: 'Total Users',
      value: statsData?.summary?.total_users?.toLocaleString() || '0',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      trend: '' // Calc trend if historical data available
    },
    {
      label: 'Total Categories',
      value: statsData?.summary?.total_categories?.toLocaleString() || '0',
      icon: Store,
      color: 'bg-green-50 text-green-600',
      trend: ''
    },
    {
      label: 'Total Products',
      value: statsData?.summary?.total_products?.toLocaleString() || '0',
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
      trend: ''
    },
    {
      label: 'Total Orders',
      value: statsData?.summary?.total_orders?.toLocaleString() || '0',
      icon: ShoppingCart,
      color: 'bg-orange-50 text-orange-600',
      trend: ''
    },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'sellers', label: 'Sellers', icon: Store },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#333] min-h-screen text-white fixed left-0 top-0">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white p-2 rounded-lg">
                <Shield className="w-6 h-6 text-[#333]" />
              </div>
              <div>
                <div className="text-sm text-gray-400">CarSUcart</div>
                <div>Admin Panel</div>
              </div>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'dashboard') {
                      setActiveTab('dashboard');
                    } else if (item.id === 'users') {
                      navigate('/admin/users');
                    } else if (item.id === 'sellers') {
                      navigate('/admin/sellers');
                    } else if (item.id === 'products') {
                      navigate('/admin/products');
                    } else if (item.id === 'orders') {
                      navigate('/admin/orders');
                    } else if (item.id === 'settings') {
                      navigate('/account-settings');
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#00D084] text-white'
                      : 'text-gray-300 hover:bg-[#444]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
            <Button
              onClick={() => navigate('/home')}
              variant="outline"
              className="w-full gap-2 border-gray-600 text-gray-300 hover:bg-[#444]"
            >
              <LogOut className="w-4 h-4" />
              Exit Admin
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-[#333]">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">Welcome back, Administrator</p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => navigate('/home')}
                    className="bg-[#00D084] hover:bg-[#00966A] gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Shop as Buyer
                  </Button>
                  <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    <span className="text-sm">System Online</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'dashboard' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`${stat.color} p-3 rounded-xl`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-green-600">{stat.trend}</span>
                      </div>
                      <div className="text-2xl text-[#333] mb-1">{loading ? '...' : stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="text-[#333] mb-6">Platform Activity</h3>
                      {/* TODO: Fetch real historical activity data */}
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={activityData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="day" stroke="#999" />
                          <YAxis stroke="#999" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e0e0e0',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="users" fill="#00D084" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="orders" fill="#00966A" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-[#333] mb-6">System Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Server Status</span>
                        <span className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Online
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Database</span>
                        <span className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Connected
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
                      <div className="text-2xl text-[#00D084]">
                        {loading ? '...' : formatPeso(statsData?.summary?.total_revenue || 0)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">All time</div>
                    </div>
                  </div>
                </div>

                {/* Recent Users Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-[#333]">Recent Users</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F8F8F8]">
                        <tr>
                          <th className="text-left px-6 py-4 text-sm text-gray-600">Name</th>
                          <th className="text-left px-6 py-4 text-sm text-gray-600">Email</th>
                          <th className="text-left px-6 py-4 text-sm text-gray-600">Role</th>
                          <th className="text-left px-6 py-4 text-sm text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                             <tr><td colSpan={4} className="text-center py-4">Loading users...</td></tr>
                        ) : (
                        recentUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-[#F8F8F8]">
                            <td className="px-6 py-4 text-[#333]">{user.name}</td>
                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                                user.role === 'Seller'
                                  ? 'bg-green-50 text-green-600'
                                  : 'bg-blue-50 text-blue-600'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                                user.status === 'Active'
                                  ? 'bg-green-50 text-green-600'
                                  : 'bg-yellow-50 text-yellow-600'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                          </tr>
                        ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}