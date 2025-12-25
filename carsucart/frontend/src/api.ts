import axios from 'axios';

// Use HTTP URL for Laravel backend (php artisan serve runs on HTTP by default)
// Change to https://localhost:8000/api if you configure HTTPS for Laravel
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    } else if (error.request) {
      console.error('API Error Request:', {
        message: 'No response received',
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        error: error.message,
      });
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth (Laravel Sanctum-based routes from routes/api.php)
export const loginApi = (payload: { email: string; password: string }) =>
  api.post('/login', payload);
export const registerApi = (payload: Record<string, unknown>) =>
  api.post('/register', payload);
export const logoutApi = () => api.post('/logout');
export const currentUserApi = () => api.get('/user');
// Placeholders (not present in backend yet)
export const verifyEmailApi = (payload: Record<string, unknown>) =>
  api.post('/auth/verify-email', payload);
export const resetPasswordApi = (payload: Record<string, unknown>) =>
  api.post('/auth/reset-password', payload);

// Products
export const fetchProductsApi = (params?: Record<string, unknown>) =>
  api.get('/products', { params });
export const fetchProductApi = (id: string) => api.get(`/products/${id}`);

// Categories
export const fetchCategoriesApi = () => api.get('/categories');
export const fetchCategoryApi = (id: string) => api.get(`/categories/${id}`);
export const createProductApi = (payload: FormData) =>
  api.post('/products', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
// Not provided in backend yet; keep placeholders for future wiring
export const searchProductsApi = (params?: Record<string, unknown>) =>
  api.get('/products', { params });
export const productSuggestionsApi = (params?: Record<string, unknown>) =>
  api.get('/products', { params });

// Cart
export const fetchCartApi = () => api.get('/cart');
export const addToCartApi = (payload: Record<string, unknown>) =>
  api.post('/cart/add', payload);
export const updateCartApi = (itemId: string, payload: Record<string, unknown>) =>
  api.put(`/cart/update/${itemId}`, payload);
export const removeCartItemApi = (itemId: string) =>
  api.delete(`/cart/remove/${itemId}`);
export const clearCartApi = () => api.delete('/cart/clear');

// Orders
export const createOrderApi = (payload: Record<string, unknown>) =>
  api.post('/orders', payload);
export const createPaymentApi = (payload: Record<string, unknown>) =>
  api.post('/payments', payload);
export const fetchOrdersApi = (params?: any) => api.get('/orders', { params });
export const fetchOrderApi = (orderId: string) => api.get(`/orders/${orderId}`);
export const updateOrderStatusApi = (orderId: string, payload: Record<string, unknown>) =>
  api.put(`/orders/${orderId}/status`, payload);

// Wishlist (not in backend routes; kept as placeholders for future)
export const addWishlistApi = (payload: Record<string, unknown>) =>
  api.post('/wishlist/add', payload);
export const removeWishlistApi = (productId: string) =>
  api.delete(`/wishlist/remove/${productId}`);
export const fetchWishlistApi = (userId: string) =>
  api.get(`/wishlist/user/${userId}`);

// Reviews
export const createReviewApi = (payload: Record<string, unknown>) =>
  api.post('/reviews', payload);
export const fetchProductReviewsApi = (productId: string) =>
  api.get('/reviews', { params: { product_id: productId } });
export const updateReviewApi = (reviewId: string, payload: Record<string, unknown>) =>
  api.put(`/reviews/${reviewId}`, payload);
export const deleteReviewApi = (reviewId: string) =>
  api.delete(`/reviews/${reviewId}`);
// Helpful endpoint not present; placeholder
export const markHelpfulReviewApi = (reviewId: string) =>
  api.post(`/reviews/${reviewId}/helpful`);

// Notifications (not present yet; placeholders)
export const fetchNotificationsApi = (userId: string) =>
  api.get(`/notifications/user/${userId}`);
export const markNotificationReadApi = (notificationId: string) =>
  api.put(`/notifications/${notificationId}/read`);
export const deleteNotificationApi = (notificationId: string) =>
  api.delete(`/notifications/${notificationId}`);
export const markAllNotificationsReadApi = () =>
  api.post('/notifications/mark-all-read');

// Messages (not present yet; placeholders)
export const fetchConversationsApi = (userId: string) =>
  api.get(`/messages/conversations/${userId}`);
export const fetchConversationApi = (conversationId: string) =>
  api.get(`/messages/conversation/${conversationId}`);
export const sendMessageApi = (payload: Record<string, unknown>) =>
  api.post('/messages/send', payload);

// Vouchers (not present yet; placeholders)
export const fetchAvailableVouchersApi = () => api.get('/vouchers/available');
export const collectVoucherApi = (voucherId: string) =>
  api.post(`/vouchers/collect/${voucherId}`);
export const fetchUserVouchersApi = (userId: string) =>
  api.get(`/vouchers/user/${userId}`);
export const createVoucherApi = (payload: Record<string, unknown>) =>
  api.post('/vouchers/create', payload);

// Stock (not exposed in current routes; placeholders)
export const fetchStockApi = (productId: string) =>
  api.get(`/products/${productId}/stock`);
export const updateStockApi = (productId: string, payload: Record<string, unknown>) =>
  api.put(`/products/${productId}/stock`, payload);
export const lowStockApi = () => api.get('/products/low-stock');
export const requestStockAlertApi = (productId: string) =>
  api.post(`/products/${productId}/stock-alert`);

export default api;

