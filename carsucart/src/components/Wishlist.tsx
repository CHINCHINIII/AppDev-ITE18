import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, X, Star, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { formatPeso } from '../lib/utils';
import { toast } from 'sonner@2.0.3';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
    toast.success('Added to cart!');
  };

  const handleMoveToCart = (item: any) => {
    handleAddToCart(item);
    removeFromWishlist(item.id);
    toast.success('Moved to cart!');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-gray-700 hover:text-[#00D084] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#00D084]" />
              <h1 className="text-[#333] text-xl">My Wishlist</h1>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-12 text-center shadow-sm"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-[#333] mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save your favorite items here</p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-[#00D084] hover:bg-[#00966A]"
            >
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      removeFromWishlist(item.id);
                      toast.success('Removed from wishlist');
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600 hover:text-red-600" />
                  </button>

                  {/* Product Image */}
                  <div
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">{item.category}</div>
                    <h3
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="text-[#333] mb-2 line-clamp-2 leading-snug cursor-pointer hover:text-[#00D084]"
                    >
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-700">{item.rating}</span>
                      <span className="text-xs text-gray-400">({item.reviews})</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-[#00D084] text-xl">{formatPeso(item.price)}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 bg-[#00D084] hover:bg-[#00966A] text-white h-9 text-sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
