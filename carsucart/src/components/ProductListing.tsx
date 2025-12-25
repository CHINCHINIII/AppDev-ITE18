import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Menu, Search, User, Star, SlidersHorizontal, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { formatPeso } from '../lib/utils';
import { ShareButtonCompact } from './ShareButtonCompact';
import { ActionButton } from './ActionButton';
import { toast } from 'sonner';
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
  variants?: string[];
}

export default function ProductListing() {
  const navigate = useNavigate();
  const { totalItems, addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(true);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products?per_page=100'), // Fetch more for client-side filtering
          api.get('/categories')
        ]);

        if (categoriesRes.data.success) {
          // Map categories to add UI props if missing
          const mappedCategories = categoriesRes.data.data.map((cat: any, index: number) => ({
             id: cat.id,
             name: cat.name,
             icon: ['📱', '📚', '👕', '🍔', '✏️', '🛠️'][index % 6], // Cycle through icons
             color: ['bg-blue-50', 'bg-yellow-50', 'bg-purple-50', 'bg-orange-50', 'bg-green-50', 'bg-red-50'][index % 6]
          }));
          setCategories(mappedCategories);
        }

        if (productsRes.data.success) {
          // Check if data is paginated (has data property array) or direct array
          const productsData = Array.isArray(productsRes.data.data) 
            ? productsRes.data.data 
            : productsRes.data.data.data;

          const mappedProducts = productsData.map((p: any) => {
            let imageUrl = `https://placehold.co/600x400?text=${encodeURIComponent(p.name)}`;
            
            if (p.image_url) {
              if (p.image_url.startsWith('http')) {
                imageUrl = p.image_url;
              } else {
                // Prepend backend URL for relative paths
                imageUrl = `http://localhost:8000${p.image_url}`;
              }
            }

            return {
              id: p.id,
              name: p.name,
              price: Number(p.price),
              image: imageUrl,
              category: p.category ? p.category.name : 'Uncategorized',
              rating: p.reviews && p.reviews.length > 0 
                ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length 
                : 0,
              reviews: p.reviews ? p.reviews.length : 0,
              stock: p.stock,
              description: p.description,
              seller: p.seller ? p.seller.name : 'Unknown Seller',
              variants: p.variants ? p.variants.map((v: any) => v.value) : []
            };
          });
          setProducts(mappedProducts);
        }
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', error.response.data);
            console.error('Error Headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error Message:', error.message);
        }
        toast.error('Failed to load products. Check console for details.');
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
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

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
                <Input
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-[#333]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#00D084] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-6 h-6 text-[#333]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-64 flex-shrink-0"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[#333]">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-sm text-gray-500 hover:text-[#00D084]"
                    >
                      Hide
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="text-[#333] mb-3">Categories</h4>
                    {loading ? (
                      <div className="space-y-2">
                         {[1, 2, 3].map(i => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {categories.map(category => (
                          <div key={category.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`cat-${category.id}`}
                              checked={selectedCategories.includes(category.name)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategories([...selectedCategories, category.name]);
                                } else {
                                  setSelectedCategories(selectedCategories.filter(c => c !== category.name));
                                }
                              }}
                            />
                            <Label htmlFor={`cat-${category.id}`} className="cursor-pointer text-sm">
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="text-[#333] mb-3">Price Range</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                          className="text-sm"
                        />
                        <span className="text-gray-400">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange({ min: 0, max: 50000 });
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[#333]">All Products</h2>
                <p className="text-gray-600">{sortedProducts.length} items found</p>
              </div>

              <div className="flex items-center gap-3">
                {!showFilters && (
                  <Button
                    onClick={() => setShowFilters(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Show Filters
                  </Button>
                )}

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm h-80 animate-pulse bg-gray-100" />
                    ))}
                 </div>
            ) : (
                <AnimatePresence mode="wait">
                <motion.div
                    key={sortBy + selectedCategories.join()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {sortedProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                        delay: index * 0.08,
                        duration: 0.4,
                        ease: 'easeOut'
                        }}
                        whileHover={{ y: -12, scale: 1.02 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 group"
                    >
                        <div onClick={() => navigate(`/product/${product.id}`)} className="relative">
                        <div className="aspect-square overflow-hidden bg-gray-100 relative">
                            <motion.img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {/* Action Buttons */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={(e) => {
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
                                }}
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
                        <div className="p-4">
                            <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                            <h3 className="text-[#333] mb-1 line-clamp-1">{product.name}</h3>
                            <div className="text-[#00D084] mb-2">
                            {formatPeso(product.price)}
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">
                                {product.rating.toFixed(1)} ({product.reviews})
                            </span>
                            </div>
                        </div>
                        </div>
                        <div className="px-4 pb-4">
                        <ActionButton
                            onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                            toast.success('Added to cart!');
                            }}
                            icon={ShoppingCart}
                            label="Add to Cart"
                            variant="primary"
                            className="w-full"
                        />
                        </div>
                    </motion.div>
                    ))}
                </motion.div>
                </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}