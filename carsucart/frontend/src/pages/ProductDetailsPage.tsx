import React, { useEffect, useState } from 'react';
import { MessageCircle, ShoppingCart, Star, Truck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import {
  addToCartApi,
  fetchProductApi,
  fetchProductReviewsApi,
  fetchOrdersApi,
  createReviewApi
} from '../api';
import type { Product, Review, Order } from '../types';
import ReviewCard from '../components/ReviewCard';
import ReviewModal from '../components/ReviewModal';
import StarRating from '../components/StarRating';
import FavoriteButton from '../components/FavoriteButton';
import MessagingModal from '../components/MessagingModal';
import OrderTrackingModal from '../components/OrderTrackingModal';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchProductApi(id).then((res) => setProduct(res.data?.data ?? res.data));
    fetchProductReviewsApi(id).then((res) => setReviews(res.data?.data ?? res.data ?? []));
    
    // Check eligibility locally by fetching orders
    fetchOrdersApi().then(res => {
        const myOrders = res.data?.data?.data || res.data?.data || [];
        const hasDelivered = myOrders.some((o: any) => 
            o.status === 'delivered' && 
            o.items?.some((i: any) => i.product_id === Number(id))
        );
        setCanReview(hasDelivered);
    }).catch(() => setCanReview(false));
  }, [id]);

  const addToCart = async () => {
    if (!product) return;
    await addToCartApi({ product_id: product.id, qty });
  };

  const toggleWishlist = () => {
    if (!product) return;
    setWishlist((prev) => !prev);
  };

  const handleReviewSubmit = async (payload: { rating: number; comment: string }) => {
      try {
          if (!product) return;
          await createReviewApi({
              product_id: product.id,
              rating: payload.rating,
              comment: payload.comment
          });
          // Refresh reviews
          const res = await fetchProductReviewsApi(String(product.id));
          setReviews(res.data?.data ?? res.data ?? []);
          setShowReview(false);
          alert('Review submitted successfully!');
      } catch (error: any) {
          console.error(error);
          alert(error.response?.data?.error || 'Failed to submit review');
      }
  };

  const getImageUrl = (url?: string) => {
      if (!url) return ''; // or placeholder
      if (url.startsWith('http')) return url;
      return url; // Vite proxy handles /uploads
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4 h-full flex items-center justify-center bg-gray-50">
          {product?.image_url ? (
               <img src={getImageUrl(product.image_url)} alt={product.name} className="max-h-[400px] w-auto object-contain rounded-lg" />
          ) : (
               <div className="aspect-video w-full rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>
        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold">{product?.name ?? 'Product'}</h1>
                <div className="text-gray-500 text-sm">{product?.brand}</div>
              </div>
              <FavoriteButton active={wishlist} onToggle={toggleWishlist} />
            </div>
            <div className="text-3xl font-bold text-primary">₱{Number(product?.price || 0).toLocaleString()}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-amber-500" /> {product?.rating ?? 'No ratings yet'}
            </div>
            <p className="text-gray-700 text-sm">{product?.description}</p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Qty</label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-20 rounded-lg border border-gray-200 px-2 py-1"
              />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="btn-primary" onClick={addToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </button>
              <button className="btn-ghost" onClick={() => setShowChat(true)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with Seller
              </button>
              <button className="btn-ghost" onClick={() => setShowTracking(true)}>
                <Truck className="h-4 w-4 mr-2" />
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <StarRating value={Math.round(reviews.reduce((a, b) => a + b.rating, 0) / (reviews.length || 1))} />
            {canReview ? (
                <button className="btn-primary" onClick={() => setShowReview(true)}>
                Write a review
                </button>
            ) : (
                <span className="text-xs text-gray-400 italic" title="You must purchase and receive this item to review it.">
                    Verified purchase required to review
                </span>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onHelpful={() => {}} />
          ))}
          {!reviews.length && <div className="text-sm text-gray-500">No reviews yet.</div>}
        </div>
      </div>

      <ReviewModal
        open={showReview}
        onClose={() => setShowReview(false)}
        onSubmit={handleReviewSubmit}
      />
      <MessagingModal open={showChat} onClose={() => setShowChat(false)} counterpartName={product?.sellerName} />
      <OrderTrackingModal
        open={showTracking}
        onClose={() => setShowTracking(false)}
        trackingNumber="TBD"
        steps={[
          { label: 'Order Placed', done: true, timestamp: new Date().toLocaleString() },
          { label: 'Payment Confirmed', done: false },
          { label: 'Processing', done: false },
          { label: 'Out for Delivery', done: false },
          { label: 'Delivered', done: false },
        ]}
      />
    </div>
  );
};

export default ProductDetailsPage;

