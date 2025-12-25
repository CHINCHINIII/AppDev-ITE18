import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Save,
  ChevronLeft,
  Camera,
  Shield,
  CreditCard
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import api from '../lib/axios';

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, login } = useAuth(); // Use login to update auth context
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Profile Photo State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    studentId: '',
    bio: '',
    store_name: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        if (response.data.success) {
          const userData = response.data.data;
          setProfileForm({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.contact_no || '',
            address: 'Caraga State University, Butuan City', // Placeholder as address isn't in DB yet
            studentId: userData.role === 'admin' ? 'ADMIN-001' : '2021-12345', // Placeholder
            bio: 'Computer Science student at CarSU', // Placeholder
            store_name: userData.store_name || ''
          });

          if (userData.profile_photo_path) {
            const photoUrl = userData.profile_photo_path.startsWith('http')
              ? userData.profile_photo_path
              : `http://localhost:8000${userData.profile_photo_path}`;
            setPhotoPreview(photoUrl);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchProfile();
  }, []);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    priceDrops: true,
    newsletter: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // Method spoofing for file upload in Laravel
      formData.append('name', profileForm.name);
      formData.append('email', profileForm.email);
      formData.append('contact_no', profileForm.phone);
      if (profileForm.store_name) {
        formData.append('store_name', profileForm.store_name);
      }
      
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await api.post('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        // Update local user context if needed, you might need to refresh auth state
        // For now, we just rely on the API response
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const msg = error.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/profile', {
        current_password: passwordForm.currentPassword,
        password: passwordForm.newPassword,
        password_confirmation: passwordForm.confirmPassword
      });

      if (response.data.success) {
        toast.success('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: any) {
       console.error('Failed to change password:', error);
       const msg = error.response?.data?.message || 'Failed to change password';
       toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  const handleSavePrivacy = () => {
    toast.success('Privacy settings saved!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

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
              <h1 className="text-[#333]">Account Settings</h1>
              <p className="text-sm text-gray-600">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#00D084] text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl text-[#333] mb-2">Profile Information</h2>
                    <p className="text-gray-600 text-sm">Update your personal information</p>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#00D084] to-[#00966A] rounded-2xl flex items-center justify-center text-white text-2xl overflow-hidden">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          profileForm.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <label htmlFor="photo-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-[#00D084] rounded-full flex items-center justify-center text-white hover:bg-[#00966A] transition-colors cursor-pointer shadow-md z-10">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          id="photo-upload"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <div className="text-[#333] mb-1">Profile Picture</div>
                      <div className="text-sm text-gray-600">PNG, JPG up to 2MB</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Full Name</label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Email</label>
                      <Input
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        type="email"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Phone Number</label>
                      <Input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Student ID</label>
                      <Input
                        value={profileForm.studentId}
                        disabled
                        className="w-full bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Address</label>
                    <Input
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084] min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {user?.role === 'seller' && (
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">Store Name</label>
                        <Input
                        value={profileForm.store_name}
                        onChange={(e) => setProfileForm({ ...profileForm, store_name: e.target.value })}
                        className="w-full"
                        />
                    </div>
                  )}

                  <Button onClick={handleSaveProfile} disabled={loading} className="bg-[#00D084] hover:bg-[#00966A] gap-2">
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl text-[#333] mb-2">Security Settings</h2>
                    <p className="text-gray-600 text-sm">Manage your password and security preferences</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <div className="mb-1">Security Tip</div>
                      <div className="text-blue-700">Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Current Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full pr-10"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">New Password</label>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Confirm New Password</label>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button onClick={handleChangePassword} disabled={loading} className="bg-[#00D084] hover:bg-[#00966A] gap-2">
                    <Lock className="w-4 h-4" />
                    {loading ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl text-[#333] mb-2">Notification Preferences</h2>
                    <p className="text-gray-600 text-sm">Choose what notifications you want to receive</p>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="text-[#333] mb-1">
                            {key === 'orderUpdates' && 'Order Updates'}
                            {key === 'promotions' && 'Promotions & Offers'}
                            {key === 'newProducts' && 'New Products'}
                            {key === 'priceDrops' && 'Price Drop Alerts'}
                            {key === 'newsletter' && 'Newsletter'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {key === 'orderUpdates' && 'Get notified about your order status'}
                            {key === 'promotions' && 'Receive special offers and promotions'}
                            {key === 'newProducts' && 'Be the first to know about new arrivals'}
                            {key === 'priceDrops' && 'Get alerts when prices drop on wishlist items'}
                            {key === 'newsletter' && 'Weekly digest of news and updates'}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              [key]: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00D084]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D084]"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleSaveNotifications} className="bg-[#00D084] hover:bg-[#00966A] gap-2">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </Button>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl text-[#333] mb-2">Privacy Settings</h2>
                    <p className="text-gray-600 text-sm">Control your privacy and data sharing</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <label className="text-[#333] mb-3 block">Profile Visibility</label>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084]"
                      >
                        <option value="public">Public - Anyone can see your profile</option>
                        <option value="carsu">CarSU Only - Only CarSU members can see</option>
                        <option value="private">Private - Only you can see</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="text-[#333] mb-1">Show Email Address</div>
                        <div className="text-sm text-gray-600">Allow others to see your email</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.showEmail}
                          onChange={(e) => setPrivacySettings({
                            ...privacySettings,
                            showEmail: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00D084]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D084]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="text-[#333] mb-1">Show Phone Number</div>
                        <div className="text-sm text-gray-600">Allow others to see your phone</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.showPhone}
                          onChange={(e) => setPrivacySettings({
                            ...privacySettings,
                            showPhone: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00D084]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D084]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="text-[#333] mb-1">Allow Messages</div>
                        <div className="text-sm text-gray-600">Let other users message you</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.allowMessages}
                          onChange={(e) => setPrivacySettings({
                            ...privacySettings,
                            allowMessages: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00D084]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D084]"></div>
                      </label>
                    </div>
                  </div>

                  <Button onClick={handleSavePrivacy} className="bg-[#00D084] hover:bg-[#00966A] gap-2">
                    <Save className="w-4 h-4" />
                    Save Settings
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
