import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Shield, Truck, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import FloatingBackground from './FloatingBackground';

export default function GetStarted() {
  const navigate = useNavigate();

  const trustBadges = [
    { icon: Shield, text: 'Secure Payments' },
    { icon: CheckCircle, text: 'Verified Sellers' },
    { icon: Truck, text: 'Fast Delivery' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00D084] via-[#00B872] to-[#00966A] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingBackground />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Logo Badge */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full mb-12 border border-white/30"
        >
          <div className="bg-white p-2.5 rounded-lg">
            <ShoppingBag className="w-7 h-7 text-[#00D084]" />
          </div>
          <span className="text-white text-2xl">CarSUcart</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white text-5xl md:text-6xl mb-6 leading-tight"
        >
          Your Campus Marketplace
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/90 text-xl mb-12 max-w-xl mx-auto"
        >
          Buy, Sell, and Connect — Powered by Caraga State University
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.4,
            type: 'spring',
            stiffness: 100
          }}
        >
          <Button
            onClick={() => navigate('/login')}
            className="bg-white text-[#00D084] hover:bg-white/95 hover:scale-105 transition-all duration-300 h-16 px-12 text-xl rounded-full shadow-2xl"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-6"
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.6 + index * 0.1,
                type: 'spring'
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20"
            >
              <badge.icon className="w-5 h-5 text-white" />
              <span className="text-white text-sm">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}