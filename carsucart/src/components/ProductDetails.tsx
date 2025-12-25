import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, Heart, ShoppingCart, ShoppingBag, Search, User, Menu, Plus, Minus, MessageSquarePlus } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPeso } from '../lib/utils';
import { toast } from 'sonner';
import { ShareButton } from './ShareButton';
import { ActionButton } from './ActionButton';
import api from '../lib/axios';
import ReviewModal from './ReviewModal';

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
  reviewsData?: any[];
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { totalItems, addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchProductAndReviews = async () => {
    try {
      // Fetch Product (Laravel)
      const productResponse = await api.get(`/products/${id}`);
      
      // Fetch Reviews (Laravel)
      const reviewsResponse = await api.get(`/reviews?product_id=${id}`);

      if (productResponse.data.success) {
        const p = productResponse.data.data;
        
        // Use reviews from API if available, otherwise fallback (or empty)
        const reviews = reviewsResponse.data.success ? reviewsResponse.data.data.data : [];

        // Image handling
        let imageUrl = `https://placehold.co/600x400?text=${encodeURIComponent(p.name)}`;
        if (p.image_url) {
           if (p.image_url.startsWith('http')) {
             imageUrl = p.image_url;
           } else {
             imageUrl = `http://localhost:8000${p.image_url}`;
           }
        }

        setProduct({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          image: imageUrl,
          category: p.category ? p.category.name : 'Uncategorized',
          // Recalculate rating based on FRESH reviews
          rating: reviews.length > 0 
            ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length 
            : 0,
          reviews: reviews.length,
          reviewsData: reviews,
          stock: p.stock,
          description: p.description,
          seller: p.seller ? p.seller.name : 'Unknown Seller',
          variants: p.variants ? p.variants.map((v: any) => v.value) : []
        });
      }
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductAndReviews().then(() => setLoading(false));
    }
  }, [id]);

  const handleReviewSubmitted = () => {
    fetchProductAndReviews();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00D084]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[#333] mb-4">Product not found</h2>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        variant: selectedVariant
      });
    }
    toast.success(`Added ${quantity} item(s) to cart ✓`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const mockImages = [product.image, product.image, product.image];

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="sticky top-24">
              <div className="h-[70vh] bg-gray-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={mockImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex gap-3">
                {mockImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-1 aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-[#00D084] scale-105' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-3">
              <span className="inline-block bg-[#00D084]/10 text-[#00D084] px-3 py-1 rounded-full text-sm">
                {product.category}
              </span>
            </div>

            <h1 className="text-[#333] mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
            </div>

            <div className="text-[#00D084] mb-6">
              {formatPeso(product.price)}
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="mb-4">
                <h3 className="text-[#333] mb-2">Seller</h3>
                <p className="text-gray-600">{product.seller}</p>
              </div>

              <div>
                <h3 className="text-[#333] mb-2">Stock</h3>
                <p className="text-gray-600">{product.stock} items available</p>
              </div>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[#333] mb-3">Select Variant</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedVariant === variant
                          ? 'border-[#00D084] bg-[#00D084]/10 text-[#00D084]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-[#333] mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="px-6 py-2 min-w-[60px] text-center">{quantity}</div>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Max: {product.stock}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <ActionButton
                onClick={handleAddToCart}
                icon={ShoppingCart}
                label="Add to Cart"
                variant="secondary"
                className="flex-1"
              />
              <ActionButton
                onClick={handleBuyNow}
                icon={ShoppingBag}
                label="Buy Now"
                variant="primary"
                className="flex-1"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => toast.success('Added to wishlist!')}
                className="flex-1 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                <span>Save</span>
              </button>
              <ShareButton 
                url={window.location.href}
                title={product.name}
                description={`Check out ${product.name} on CarSUcart - ${formatPeso(product.price)}`}
                className="flex-1"
              />
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00D084] data-[state=active]:text-[#00D084] px-6 py-3"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00D084] data-[state=active]:text-[#00D084] px-6 py-3"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="py-6">
              <div className="prose max-w-none">
                <p className="text-gray-600">{product.description}</p>
                <h3 className="text-[#333] mt-6 mb-3">Features</h3>
                <ul className="text-gray-600">
                  <li>High quality product</li>
                  <li>Verified seller</li>
                  <li>Meet-up available on campus</li>
                  <li>Satisfaction guaranteed</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-[#333]">Customer Reviews</h3>
                  {user && user.role === 'buyer' && (
                    <Button 
                      onClick={() => setIsReviewModalOpen(true)}
                      className="bg-[#00D084] hover:bg-[#00966A] gap-2"
                    >
                      <MessageSquarePlus className="w-4 h-4" />
                      Write a Review
                    </Button>
                  )}
                </div>

                {product.reviewsData && product.reviewsData.length > 0 ? (
                  product.reviewsData.map((review: any) => (
                    <div key={review.id} className="bg-[#F8F8F8] rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#00D084] rounded-full flex items-center justify-center text-white">
                          {review.user ? review.user.name.charAt(0) : 'A'}
                        </div>
                        <div>
                          <div className="text-[#333]">{review.user ? review.user.name : 'Anonymous'}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="ml-auto text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600 mt-2">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-[#F8F8F8] rounded-xl">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productId={product.id}
        productName={product.name}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}