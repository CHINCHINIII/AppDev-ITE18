import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Package, Home } from 'lucide-react';
import { Button } from './ui/button';

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00D084] via-[#00B872] to-[#00966A] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating celebration elements */}
      <motion.div
        className="absolute top-20 left-20 text-6xl"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🎉
      </motion.div>
      <motion.div
        className="absolute top-32 right-32 text-5xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, -10, 10, 0],
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-40 text-6xl"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 15, -15, 0],
        }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
      >
        🎊
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-24 text-5xl"
        animate={{
          y: [0, -35, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      >
        🎈
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          type: 'spring',
          stiffness: 100
        }}
        className="bg-white rounded-3xl p-12 max-w-2xl w-full mx-auto text-center shadow-2xl relative z-10"
      >
        {/* Success Icon with animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.3, 
            type: 'spring',
            stiffness: 200,
            damping: 10
          }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-[#00D084] rounded-full mx-auto flex items-center justify-center relative">
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-[#00D084]"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[#333] text-3xl mb-4"
        >
          Order Placed Successfully! 
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mb-8 text-lg"
        >
          Thank you for your purchase! Your order has been confirmed and will be processed shortly.
        </motion.p>

        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-6 h-6 text-[#00D084]" />
            <h3 className="text-[#333]">Order Details</h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="text-[#333]">#CSU{Math.floor(Math.random() * 100000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Delivery:</span>
              <span className="text-[#333]">1-2 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-[#00D084]">Processing</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            onClick={() => navigate('/home')}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
          <Button
            onClick={() => navigate('/my-orders')}
            className="flex-1 bg-[#00D084] hover:bg-[#00966A] gap-2"
          >
            <Package className="w-5 h-5" />
            Track Order
          </Button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-sm text-gray-600"
        >
          <p>
            Need help? Contact the seller or visit our{' '}
            <a href="#" className="text-[#00D084] hover:underline">
              Help Center
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}