import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { WishlistProvider } from './contexts/WishlistContext';
import GetStarted from './components/GetStarted';
import LoginHub from './components/LoginHub';
import Login from './components/Login';
import Registration from './components/Registration';
import HomePage from './components/HomePage';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import SellerDashboard from './components/SellerDashboard';
import MyProducts from './components/MyProducts';
import SellerOrders from './components/SellerOrders';
import AddEditProduct from './components/AddEditProduct';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers';
import AdminSellers from './components/AdminSellers';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import ProfilePage from './components/ProfilePage';
import SellerRegistration from './components/SellerRegistration';
import Wishlist from './components/Wishlist';
import MyOrders from './components/MyOrders';
import AccountSettings from './components/AccountSettings';
import AddressesPage from './components/AddressesPage';
import PaymentMethods from './components/PaymentMethods';
import HelpSupport from './components/HelpSupport';
import { Toaster } from 'sonner@2.0.3';

export default function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen bg-white">
                <Routes>
                  <Route path="/" element={<GetStarted />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/login-hub" element={<LoginHub />} />
                  <Route path="/register" element={<Registration />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/products" element={<ProductListing />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                  <Route path="/seller/products" element={<MyProducts />} />
                  <Route path="/seller/orders" element={<SellerOrders />} />
                  <Route path="/seller/product/new" element={<AddEditProduct />} />
                  <Route path="/seller/product/edit/:id" element={<AddEditProduct />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/sellers" element={<AdminSellers />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/seller-register" element={<SellerRegistration />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/account-settings" element={<AccountSettings />} />
                  <Route path="/addresses" element={<AddressesPage />} />
                  <Route path="/payment-methods" element={<PaymentMethods />} />
                  <Route path="/help-support" element={<HelpSupport />} />
                </Routes>
                <Toaster position="top-right" />
              </div>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </OrderProvider>
    </AuthProvider>
  );
}