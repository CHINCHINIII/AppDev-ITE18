import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, Key } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    accessCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.accessCode !== 'ADMIN123') {
      toast.error('Invalid admin access code');
      return;
    }

    await login(formData.email, formData.password, 'admin');
    toast.success('Welcome, Admin!');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-block bg-[#333] p-4 rounded-2xl mb-4"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-[#333] mb-2">Admin Access</h1>
          <p className="text-gray-600">Secure administrative portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[#333] p-6 text-center">
            <h2 className="text-white">Administrator Login</h2>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Admin Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@carsu.edu.ph"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accessCode">Access Code</Label>
                <div className="relative mt-1">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="accessCode"
                    type="password"
                    placeholder="Enter admin access code"
                    value={formData.accessCode}
                    onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Hint: Use "ADMIN123" for demo
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#333] hover:bg-[#444] mt-6"
              >
                Access Admin Panel
              </Button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#00D084] hover:underline text-sm"
                >
                  Back to regular login
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>🔒 Secure administrative access only</p>
        </div>
      </motion.div>
    </div>
  );
}
