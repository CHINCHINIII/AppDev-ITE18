import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, ShoppingCart, User, Menu, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCart } from '../contexts/CartContext';
import { formatPeso } from '../lib/utils';
import { toast } from 'sonner@2.0.3';

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  const shippingFee = 50;
  const total = totalPrice + shippingFee;

  const handleRemove = (id: number, name: string) => {
    removeFromCart(id);
    toast.success(`${name} removed from cart`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-white border-b border-gray-200 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                <div className="bg-[#00D084] p-2 rounded-lg">
                  <Menu className="w-5 h-5 text-white" />
                </div>
                <span className="text-[#333]">CarSUcart</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-[#333] mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start adding items to your cart!</p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-[#00D084] hover:bg-[#00966A]"
            >
              Browse Products
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
              <div className="bg-[#00D084] p-2 rounded-lg">
                <Menu className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#333]">CarSUcart</span>
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input placeholder="Search for products..." className="pl-10 h-11" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 bg-[#00D084]/10 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-[#00D084]" />
                <span className="absolute -top-1 -right-1 bg-[#00D084] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-6 h-6 text-[#333]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-[#333] mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.variant}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[#333] mb-1">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-gray-500 mb-2">Variant: {item.variant}</p>
                    )}
                    <div className="text-[#00D084]">
                      {formatPeso(item.price)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>

                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="px-4 py-1 min-w-[50px] text-center">{item.quantity}</div>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4">
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                className="gap-2"
              >
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#F8F8F8] rounded-2xl p-6 sticky top-24">
              <h2 className="text-[#333] mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="text-[#333]">{formatPeso(totalPrice)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="text-[#333]">{formatPeso(shippingFee)}</span>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#333]">Total</span>
                    <span className="text-[#00D084] text-xl">
                      {formatPeso(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full h-12 bg-[#00D084] hover:bg-[#00966A] gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Proceed to Checkout
              </Button>

              <div className="mt-4 p-4 bg-white rounded-xl">
                <p className="text-sm text-gray-600 text-center">
                  🎓 Free delivery for orders over ₱500 within CSU campus
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}