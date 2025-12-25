import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  ChevronRight,
  Package,
  CreditCard,
  Bell,
  HelpCircle,
  Shield,
  Store,
  BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { toast } from 'sonner';
import api from '../lib/axios';
import NotificationsPanel from './NotificationsPanel';

interface UserData {
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  studentId: string;
  shopName?: string;
  profile_photo_path?: string;
  joinedDate: string;
  stats: {
    orders_count?: number;
    reviews_count?: number;
    products_count?: number;
    total_sales?: number;
    revenue?: number;
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const { wishlistCount } = useWishlist();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login-hub');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/profile');
        if (response.data.success) {
          const apiUser = response.data.data;
          
          // Determine joined date format
          const joinedDate = new Date(apiUser.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          });

          setUserData({
            name: apiUser.name,
            email: apiUser.email,
            role: apiUser.role,
            phone: apiUser.contact_no || '+63 912 345 6789',
            address: 'Caraga State University, Butuan City', // Placeholder
            studentId: apiUser.role === 'admin' ? 'ADMIN-001' : '2021-12345', // Placeholder
            shopName: apiUser.store_name,
            profile_photo_path: apiUser.profile_photo_path,
            joinedDate: joinedDate,
            stats: apiUser.stats || {}
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    // Navigate to role selection page
    navigate('/login-hub');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00D084]"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const menuItems = {
    buyer: [
      { icon: Package, label: 'My Orders', count: userData.stats.orders_count || 0, action: () => navigate('/my-orders') },
      { icon: Heart, label: 'Wishlist', count: wishlistCount, action: () => navigate('/wishlist') },
      { icon: MapPin, label: 'Addresses', action: () => navigate('/addresses') },
      { icon: CreditCard, label: 'Payment Methods', action: () => navigate('/payment-methods') },
    ],
    seller: [
      { icon: BarChart3, label: 'Dashboard', action: () => navigate('/seller/dashboard') },
      { icon: Package, label: 'My Products', count: userData.stats.products_count, action: () => navigate('/seller/products') },
      { icon: ShoppingBag, label: 'My Orders', count: userData.stats.total_sales, action: () => navigate('/my-orders') },
      { icon: Store, label: 'Shop Settings', action: () => navigate('/account-settings') },
    ],
    admin: [
      { icon: BarChart3, label: 'Admin Dashboard', action: () => navigate('/admin/dashboard') },
      { icon: Package, label: 'Manage Products', action: () => navigate('/admin/products') },
      { icon: User, label: 'Manage Users', action: () => navigate('/admin/users') },
      { icon: Shield, label: 'System Settings', action: () => navigate('/account-settings') },
    ]
  };

  const generalMenuItems = [
    { icon: Bell, label: 'Notifications', action: () => setShowNotifications(true) },
    { icon: Settings, label: 'Account Settings', action: () => navigate('/account-settings') },
    { icon: HelpCircle, label: 'Help & Support', action: () => navigate('/help-support') },
  ];

  const roleSpecificMenu = menuItems[userData.role as keyof typeof menuItems] || [];

  // Helper to get profile image URL
  const getProfileImage = () => {
    if (userData.profile_photo_path) {
      if (userData.profile_photo_path.startsWith('http')) {
        return userData.profile_photo_path;
      }
      return `http://localhost:8000${userData.profile_photo_path}`;
    }
    return null;
  };

  const profileImage = getProfileImage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-gray-700 hover:text-[#00D084] transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-[#333]">My Profile</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 mb-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#00D084] to-[#00966A] rounded-2xl flex items-center justify-center text-white text-3xl overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt={userData.name} className="w-full h-full object-cover" />
                ) : (
                  userData.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-lg text-xs text-white ${
                userData.role === 'admin' ? 'bg-purple-500' :
                userData.role === 'seller' ? 'bg-blue-500' :
                'bg-[#00D084]'
              }`}>
                {userData.role === 'admin' ? 'Admin' : userData.role === 'seller' ? 'Seller' : 'Buyer'}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-[#333] text-2xl mb-1">{userData.name}</h2>
              {userData.shopName && (
                <p className="text-gray-600 mb-2">
                  <Store className="w-4 h-4 inline mr-1" />
                  {userData.shopName}
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{userData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{userData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{userData.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">ID: {userData.studentId}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => navigate('/account-settings')}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>

          {/* Stats - Role Specific */}
          {(userData.role === 'buyer' || userData.role === 'seller') && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              {userData.role === 'buyer' ? (
                <>
                  <div className="text-center">
                    <div className="text-2xl text-[#00D084] mb-1">{userData.stats.orders_count || 0}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-[#00D084] mb-1">{wishlistCount}</div>
                    <div className="text-sm text-gray-600">Wishlist Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-[#00D084] mb-1">{userData.stats.reviews_count || 0}</div>
                    <div className="text-sm text-gray-600">Reviews</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-2xl text-[#00D084] mb-1">{userData.stats.total_sales || 0}</div>
                    <div className="text-sm text-gray-600">Total Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-[#00D084] mb-1">₱{(userData.stats.revenue || 0).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-[#00D084] mb-1">4.8</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Role-Specific Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-[#333] mb-4">
            {userData.role === 'admin' ? 'Admin Tools' : userData.role === 'seller' ? 'Seller Tools' : 'My Activity'}
          </h3>
          <div className="space-y-2">
            {roleSpecificMenu.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#00D084]/10 transition-colors">
                    <item.icon className="w-5 h-5 text-gray-600 group-hover:text-[#00D084] transition-colors" />
                  </div>
                  <span className="text-gray-700 group-hover:text-[#00D084] transition-colors">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.count !== undefined && (
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-sm">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#00D084] transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* General Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-[#333] mb-4">General</h3>
          <div className="space-y-2">
            {generalMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#00D084]/10 transition-colors">
                    <item.icon className="w-5 h-5 text-gray-600 group-hover:text-[#00D084] transition-colors" />
                  </div>
                  <span className="text-gray-700 group-hover:text-[#00D084] transition-colors">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#00D084] transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleLogout}
            className="w-full bg-white border-2 border-red-200 text-red-600 rounded-2xl p-4 hover:bg-red-50 transition-colors flex items-center justify-center gap-3 shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-sm text-gray-500"
        >
          Member since {userData.joinedDate}
        </motion.div>
      </div>
      
      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}