export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
  category: string;
  rating?: number;
  reviews?: number;
  description?: string;
  specifications?: string;
  stock?: number;
  sellerId?: string;
  sellerName?: string;
  status?: 'active' | 'pending' | 'rejected';
  featured?: boolean;
  brand?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  sellerId?: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'gcash';
  cardNumber?: string;
  cardholderName?: string;
  expiryDate?: string;
  gcashNumber?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'placed';
  shippingAddress?: Address;
  paymentMethod?: string;
  createdAt?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  contact_no?: string;
  store_name?: string;
  role: 'buyer' | 'seller' | 'admin';
  status?: 'active' | 'suspended';
  avatar?: string;
  createdAt?: string;
  token?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'promotion' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful?: number;
  images?: string[];
}

