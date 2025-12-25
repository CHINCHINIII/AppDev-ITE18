import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Store, Mail, Lock, Phone, User, Tag, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

export default function SellerRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    studentId: '',
    shopName: '',
    storeCategory: '',
    shopDescription: '',
    agreeToTerms: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please accept the seller terms and conditions');
      return;
    }

    if (!formData.shopName || !formData.storeCategory) {
      toast.error('Please fill in all required seller information');
      return;
    }

    await register({ ...formData, role: 'seller' });
    
    setShowSuccess(true);
    setTimeout(() => {
      toast.success('Seller account created successfully!');
      navigate('/seller/dashboard');
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F8F8] to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <CheckCircle2 className="w-24 h-24 text-[#00D084] mb-4" />
          </motion.div>
          <h2 className="text-[#333] mb-2">Seller Account Created!</h2>
          <p className="text-gray-600">Welcome to CarSUcart Seller Hub</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8F8] to-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#00D084] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </motion.button>

        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-[#00966A] p-3 rounded-xl shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl text-[#333]">Become a Seller</span>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            Start your own shop at CarSUcart and reach thousands of CSU students
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#00966A] to-[#007d57] p-6 text-white">
            <h2 className="mb-1">Seller Registration</h2>
            <p className="text-white/90 text-sm">Fill in your details to start selling</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-[#333] text-sm pb-2 border-b border-gray-200">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Juan Dela Cruz"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="studentId">Student ID *</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="studentId"
                      placeholder="2021-12345"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="pl-10 h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@carsu.edu.ph"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="09XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10 h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Information */}
            <div className="space-y-4 pt-4">
              <h3 className="text-[#333] text-sm pb-2 border-b border-gray-200">Shop Information</h3>
              
              <div>
                <Label htmlFor="shopName">Shop Name *</Label>
                <div className="relative mt-1">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="shopName"
                    placeholder="My Awesome Shop"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">This is how customers will find your shop</p>
              </div>

              <div>
                <Label htmlFor="storeCategory">Primary Category *</Label>
                <div className="relative mt-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <Select
                    value={formData.storeCategory}
                    onValueChange={(value) => setFormData({ ...formData, storeCategory: value })}
                    required
                  >
                    <SelectTrigger className="pl-10 h-11 rounded-xl">
                      <SelectValue placeholder="Select your main product category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics & Gadgets</SelectItem>
                      <SelectItem value="books">Books & Study Materials</SelectItem>
                      <SelectItem value="clothing">Clothing & Accessories</SelectItem>
                      <SelectItem value="food">Food & Beverages</SelectItem>
                      <SelectItem value="supplies">School Supplies</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="shopDescription">Shop Description *</Label>
                <Textarea
                  id="shopDescription"
                  placeholder="Tell customers about your shop and what makes it special..."
                  value={formData.shopDescription}
                  onChange={(e) => setFormData({ ...formData, shopDescription: e.target.value })}
                  className="mt-1 rounded-xl min-h-[100px]"
                  required
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-4">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-1 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-[#00966A] hover:underline">
                  Seller Terms and Conditions
                </a>
                {', '}
                <a href="#" className="text-[#00966A] hover:underline">
                  Seller Guidelines
                </a>
                {', and '}
                <a href="#" className="text-[#00966A] hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-6 bg-[#00966A] hover:bg-[#007d57] rounded-xl text-base"
            >
              Create Seller Account
            </Button>

            <div className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#00966A] hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
