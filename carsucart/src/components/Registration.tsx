import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

export default function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      toast.error('Please accept the terms and conditions');
      return;
    }

    await register({ ...formData, role: 'buyer' });
    
    setShowSuccess(true);
    setTimeout(() => {
      toast.success('Account created successfully!');
      navigate('/home');
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4">
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
          <h2 className="text-[#333] mb-2">Account Created!</h2>
          <p className="text-gray-600">Redirecting you to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-[#00D084] p-3 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <span className="text-[#333]">CarSUcart</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="animated-title text-center mb-2">
            Create Account
          </h2>
          <p className="animated-message text-center mb-8">
            Sign up to start your shopping journey
          </p>

          <form onSubmit={handleSubmit} className="animated-form">
            <label className="animated-label">
              <Input
                id="name"
                placeholder=" "
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="animated-input"
                required
              />
              <span>Full Name</span>
            </label>

            <label className="animated-label">
              <Input
                id="email"
                type="email"
                placeholder=" "
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="animated-input"
                required
              />
              <span>Email</span>
            </label>

            <label className="animated-label">
              <Input
                id="password"
                type="password"
                placeholder=" "
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="animated-input"
                required
              />
              <span>Password</span>
            </label>

            <label className="animated-label">
              <Input
                id="confirmPassword"
                type="password"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="animated-input"
                required
              />
              <span>Confirm Password</span>
            </label>

            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#00D084] focus:ring-[#00D084]"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-[#00D084] hover:underline">
                  Terms and Conditions
                </a>
                {' '}and{' '}
                <a href="#" className="text-[#00D084] hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-6 bg-[#00D084] hover:bg-[#00966A] text-white"
            >
              Register
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#00D084] hover:underline text-sm"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      <style>{`
        .animated-title {
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -1px;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding-left: 30px;
          color: #00D084;
          width: 100%;
        }

        .animated-title::before,
        .animated-title::after {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          border-radius: 50%;
          left: 50%;
          margin-left: -135px;
          background-color: #00D084;
        }

        .animated-title::before {
          width: 18px;
          height: 18px;
        }

        .animated-title::after {
          width: 18px;
          height: 18px;
          animation: pulse 1s linear infinite;
        }

        .animated-message {
          color: rgba(88, 87, 87, 0.822);
          font-size: 14px;
        }

        .animated-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .animated-label {
          position: relative;
          display: block;
        }

        .animated-input {
          width: 100%;
          padding: 18px 12px 12px 12px !important;
          outline: 0;
          border: 1px solid rgba(105, 105, 105, 0.397) !important;
          border-radius: 10px !important;
          background: white !important;
          font-size: 14px;
          box-shadow: none !important;
          height: auto !important;
        }

        .animated-label span {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          font-size: 14px;
          cursor: text;
          transition: all 0.3s ease;
          pointer-events: none;
          background: white;
          padding: 0 4px;
        }

        .animated-input:not(:placeholder-shown) + span,
        .animated-input:focus + span {
          top: 0;
          transform: translateY(-50%);
          font-size: 12px;
          font-weight: 600;
          color: #00D084;
        }

        .animated-input:focus {
          border-color: #00D084 !important;
          box-shadow: 0 0 0 3px rgba(0, 208, 132, 0.1) !important;
        }

        @keyframes pulse {
          from {
            transform: scale(0.9);
            opacity: 1;
          }
          to {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
