import { motion } from 'motion/react';
import { ShoppingBag, Shield, Truck, Star, Heart, Package } from 'lucide-react';

interface FloatingBackgroundProps {
  color?: string;
}

export default function FloatingBackground({ color = '#00D084' }: FloatingBackgroundProps) {
  const floatingCircles = [
    { size: 200, x: '10%', y: '15%', delay: 0, duration: 20 },
    { size: 150, x: '80%', y: '20%', delay: 2, duration: 18 },
    { size: 100, x: '5%', y: '70%', delay: 1, duration: 22 },
    { size: 120, x: '85%', y: '75%', delay: 3, duration: 19 },
    { size: 180, x: '50%', y: '50%', delay: 1.5, duration: 25 },
  ];

  const floatingIcons = [
    { Icon: ShoppingBag, x: '15%', y: '25%', delay: 0, size: 40 },
    { Icon: Shield, x: '75%', y: '65%', delay: 1, size: 35 },
    { Icon: Truck, x: '85%', y: '35%', delay: 0.5, size: 38 },
    { Icon: Star, x: '10%', y: '60%', delay: 1.5, size: 32 },
    { Icon: Heart, x: '90%', y: '80%', delay: 2, size: 30 },
    { Icon: Package, x: '20%', y: '85%', delay: 0.8, size: 36 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Circles */}
      {floatingCircles.map((circle, index) => (
        <motion.div
          key={`circle-${index}`}
          className="absolute rounded-full"
          style={{
            width: circle.size,
            height: circle.size,
            left: circle.x,
            top: circle.y,
            background: `radial-gradient(circle, ${color}20, transparent)`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            delay: circle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={`icon-${index}`}
          className="absolute"
          style={{
            left: item.x,
            top: item.y,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
        >
          <item.Icon 
            className="text-white"
            size={item.size}
            strokeWidth={1.5}
          />
        </motion.div>
      ))}
    </div>
  );
}
