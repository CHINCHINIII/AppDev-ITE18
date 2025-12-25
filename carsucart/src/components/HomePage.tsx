import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Bell, User, Heart, Star, TrendingUp, Package, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useOrders } from '../contexts/OrderContext';
import { formatPeso } from '../lib/utils';
import { toast } from 'sonner';
import NotificationsPanel from './NotificationsPanel';
import { ShareButtonCompact } from './ShareButtonCompact';
import { ActionButton } from './ActionButton';
import api from '../lib/axios';

interface Category {
  id: number;
  name: string;
  icon?: string;
  color?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  seller: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { totalItems, addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistCount } = useWishlist();
  const { unreadNotifications } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products?per_page=8&sort_by=created_at').catch(err => {
            console.error('❌ Products API error:', err);
            console.error('Error type:', err.code || err.name);
            console.error('Error message:', err.message);
            
            if (err.response) {
              // Server responded with error
              console.error('Response status:', err.response.status);
              console.error('Response data:', err.response.data);
            } else if (err.request) {
              // Request made but no response (connection failed)
              console.error('❌ CONNECTION FAILED - No response from server');
              console.error('Request URL:', err.config?.url);
              console.error('Base URL:', err.config?.baseURL);
              console.error('Full URL:', err.config?.baseURL + err.config?.url);
              console.error('💡 TIP: Make sure Laravel is running: php artisan serve');
            } else {
              console.error('Request setup error:', err.message);
            }
            
            throw new Error(
              err.response?.data?.message || 
              err.message ||
              `Connection failed. Please make sure Laravel backend is running on http://localhost:8000. Run: php artisan serve`
            );
          }),
          api.get('/categories').catch(err => {
            console.error('Categories API error:', err);
            if (err.request) {
              console.error('Categories connection failed - backend may not be running');
            }
            // Don't throw for categories, just log and continue
            return { data: { success: false, data: [], error: err.response?.data || err.message } };
          })
        ]);

        // Handle categories
        console.log('Categories API Response:', categoriesRes.data);
        if (categoriesRes.data?.success && categoriesRes.data.data) {
          const categoriesData = Array.isArray(categoriesRes.data.data) 
            ? categoriesRes.data.data 
            : (categoriesRes.data.data.data || []);
          
          console.log('Categories data extracted:', categoriesData);
          const mappedCategories = categoriesData.map((cat: any, index: number) => ({
            id: cat.id,
            name: cat.name,
            icon: ['📱', '📚', '👕', '🍔', '🎮', '👟', '🎨', '🏀'][index % 8],
            color: ['bg-blue-50', 'bg-yellow-50', 'bg-purple-50', 'bg-orange-50', 'bg-green-50', 'bg-red-50'][index % 6]
          }));
          setCategories(mappedCategories);
        } else {
          console.warn('Categories response format unexpected:', categoriesRes.data);
        }

        // Handle products - STRICT parsing to ensure products always appear
        console.log('Products API Response:', productsRes.data);
        
        if (productsRes.data) {
          let productsData = [];
          
          // Handle different response formats
          if (productsRes.data.success && productsRes.data.data) {
            // Format 1: { success: true, data: { data: [...], current_page, ... } } - paginated
            if (productsRes.data.data.data && Array.isArray(productsRes.data.data.data)) {
              productsData = productsRes.data.data.data;
            }
            // Format 2: { success: true, data: [...] } - direct array
            else if (Array.isArray(productsRes.data.data)) {
              productsData = productsRes.data.data;
            }
          }
          // Format 3: Direct array response
          else if (Array.isArray(productsRes.data)) {
            productsData = productsRes.data;
          }
          // Format 4: { data: [...] }
          else if (Array.isArray(productsRes.data.data)) {
            productsData = productsRes.data.data;
          }

          console.log('Products data extracted:', productsData.length, 'products');
          
          if (productsData.length > 0) {
            console.log('First product sample:', productsData[0]);
            
            const mappedProducts = productsData.map((p: any) => {
              // Get image URL - prefer image_url from database, fallback to placeholder
              let imageUrl = `https://placehold.co/600x400?text=${encodeURIComponent(p.name || 'Product')}`;
              
              if (p.image_url) {
                if (p.image_url.startsWith('http')) {
                  imageUrl = p.image_url;
                } else {
                  imageUrl = `http://localhost:8000${p.image_url}`;
                }
              }

              // Extract category name from various possible formats
              let categoryName = 'Uncategorized';
              if (p.category) {
                categoryName = typeof p.category === 'string' ? p.category : (p.category.name || categoryName);
              } else if (p.category_name) {
                categoryName = p.category_name;
              }

              // Extract seller name from various possible formats
              let sellerName = 'Unknown Seller';
              if (p.seller) {
                sellerName = typeof p.seller === 'string' ? p.seller : (p.seller.name || sellerName);
              } else if (p.seller_name) {
                sellerName = p.seller_name;
              }

              // Calculate rating
              let rating = 0;
              if (p.reviews && Array.isArray(p.reviews) && p.reviews.length > 0) {
                const totalRating = p.reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0);
                rating = totalRating / p.reviews.length;
              } else if (p.rating !== undefined) {
                rating = Number(p.rating) || 0;
              }

              return {
                id: p.id,
                name: p.name || 'Unnamed Product',
                price: Number(p.price) || 0,
                image: imageUrl,
                category: categoryName,
                rating: Math.round(rating * 10) / 10, // Round to 1 decimal
                reviews: p.reviews && Array.isArray(p.reviews) ? p.reviews.length : (Number(p.reviews_count) || 0),
                stock: Number(p.stock) || 0,
                description: p.description || '',
                seller: sellerName
              };
            });
            
            console.log('Mapped products:', mappedProducts.length);
            setProducts(mappedProducts);
          } else {
            console.warn('No products found in response data');
            setProducts([]);
          }
        } else {
          console.error('Invalid API response structure:', productsRes);
          setProducts([]);
        }
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        console.error('Error type:', typeof error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          console.error('Error response data:', error.response.data);
        }
        const errorMessage = error.message || 'Failed to load products. Please make sure the backend server is running on http://localhost:8000';
        alert(errorMessage);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews
      });
      toast.success('Added to wishlist!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer flex-shrink-0"
              onClick={() => navigate('/home')}
            >
              <div className="bg-[#00D084] p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <span className="text-xl text-[#333]">CarSUcart</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search products, categories, or sellers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-11 bg-gray-50 border-gray-200 rounded-lg focus:bg-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery) {
                      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                />
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6 text-gray-700" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <button 
                onClick={() => navigate('/wishlist')}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Heart className="w-6 h-6 text-gray-700" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#00D084] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => navigate('/cart')}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-[#00D084] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button 
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[#00D084] to-[#00966A] rounded-3xl p-12 text-white mb-8 relative overflow-hidden"
          >
            {/* Floating background elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-5xl mb-4"
              >
                Welcome to CarSUcart
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-white/90 text-lg mb-8 max-w-2xl"
              >
                Your one-stop marketplace for everything you need at Caraga State University
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex gap-4"
              >
                <Button
                  onClick={() => navigate('/products')}
                  className="bg-white text-[#00D084] hover:bg-gray-100 hover:scale-105 transition-all duration-300 h-12 px-8 rounded-lg shadow-sm"
                >
                  Start Shopping
                </Button>
                <Button
                  onClick={() => navigate('/seller-register')}
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 h-12 px-8 rounded-lg"
                >
                  Become a Seller
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-[#333] text-2xl mb-2">Browse Categories</h2>
            <p className="text-gray-600">Find what you need faster</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading ? (
                [1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                ))
            ) : categories.length > 0 ? (
                categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => navigate('/products')}
                        className={`${category.color} p-6 rounded-2xl text-center hover:shadow-md transition-shadow`}
                    >
                        <div className="text-4xl mb-3">{category.icon}</div>
                        <div className="text-[#333] text-sm">{category.name}</div>
                    </button>
                ))
            ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No categories available. Please make sure the backend server is running.
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[#333] text-2xl mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked items just for you</p>
            </div>
            <Button
              onClick={() => navigate('/products')}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
                [1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-2xl h-80 animate-pulse bg-gray-100" />
                ))
            ) : products.length > 0 ? (
                products.slice(0, 8).map((product) => (
                <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 group"
                >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                        <span className="bg-white/95 backdrop-blur-sm text-[#00D084] text-xs px-3 py-1.5 rounded-full shadow-sm">
                        {product.stock < 5 ? 'Low Stock' : 'In Stock'}
                        </span>
                    </div>
                    {/* Action Buttons */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                        onClick={(e) => handleToggleWishlist(product, e)}
                        className="bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors"
                        >
                        <Heart 
                            className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
                        />
                        </button>
                        <ShareButtonCompact
                        url={`${window.location.origin}/product/${product.id}`}
                        title={product.name}
                        description={`Check out ${product.name} on CarSUcart - ${formatPeso(product.price)}`}
                        />
                    </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                    <h3 className="text-[#333] mb-2 line-clamp-2 leading-snug">
                        {product.name}
                    </h3>
                    
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-[#00D084] text-xl">{formatPeso(product.price)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-700">{product.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                        </div>
                        
                        <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                        }}
                        size="sm"
                        className="bg-[#00D084] hover:bg-[#00bb77] text-white h-8 px-4 rounded-lg text-sm"
                        >
                        Add
                        </Button>
                    </div>
                    </div>
                </div>
                ))
            ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 mb-4">No products available</div>
                  <div className="text-sm text-gray-400">
                    Please make sure the backend server is running on http://localhost:8000
                  </div>
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-[#00D084] hover:bg-[#00bb77] text-white"
                  >
                    Retry
                  </Button>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Sellers Section */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-[#333] text-2xl mb-2">Popular Sellers</h2>
            <p className="text-gray-600">Trusted by students</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Tech Corner CSU', 'BookHub CSU', 'Campus Store', 'Student Essentials'].map((seller, index) => (
              <div
                key={seller}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#00D084] to-[#00966A] rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl">
                  {seller.charAt(0)}
                </div>
                <h3 className="text-[#333] text-sm mb-1">{seller}</h3>
                <p className="text-xs text-gray-500">{Math.floor(Math.random() * 50) + 20} products</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#00D084] p-2 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl">CarSUcart</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted campus marketplace for Caraga State University students.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm mb-4">For Sellers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Start Selling</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seller Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 CarSUcart. Powered by Caraga State University. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}