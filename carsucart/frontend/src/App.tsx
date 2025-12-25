import React from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import MyOrdersPage from './pages/MyOrdersPage';
import WishlistPage from './pages/WishlistPage';
import VouchersPage from './pages/VouchersPage';
import MessagesPage from './pages/MessagesPage';
import SellerStorePage from './pages/SellerStorePage';
import ProductComparePage from './pages/ProductComparePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import PlaceholderPage from './pages/Placeholder';
import SellerDashboard from './pages/SellerDashboard';
import CheckoutPage from './pages/CheckoutPage';

const GetStarted: React.FC = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div className="max-w-3xl w-full text-center space-y-8 bg-white p-10 rounded-2xl shadow-xl">
      <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
        Welcome to <span className="text-blue-600">CarSUcart</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        The premier campus e-commerce platform designed for students and faculty. 
        Buy, sell, and connect with your campus community seamlessly.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
        <Link 
          to="/login-hub" 
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-200"
        >
          Get Started
        </Link>
        <Link 
          to="/products" 
          className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-100 rounded-xl font-bold text-lg shadow-md hover:border-blue-300 transform hover:-translate-y-1 transition-all duration-200"
        >
          Browse Products
        </Link>
      </div>
      
      <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-100">
        <div>
           <div className="text-blue-600 font-bold text-2xl mb-1">Secure</div>
           <p className="text-gray-500 text-sm">Verified campus users</p>
        </div>
        <div>
           <div className="text-blue-600 font-bold text-2xl mb-1">Fast</div>
           <p className="text-gray-500 text-sm">Meet-up & Delivery</p>
        </div>
        <div>
           <div className="text-blue-600 font-bold text-2xl mb-1">Local</div>
           <p className="text-gray-500 text-sm">Support campus sellers</p>
        </div>
      </div>
    </div>
  </div>
);

const LoginHub: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 p-6">
    <div className="max-w-4xl w-full space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">Choose Your Role</h1>
      <div className="grid sm:grid-cols-3 gap-6">
        <Link to="/buyer-login" className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-transparent hover:border-blue-500 text-center">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Buyer</h2>
          <p className="text-gray-500 text-sm">Shop for products and essentials.</p>
        </Link>

        <Link to="/seller-login" className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-transparent hover:border-green-500 text-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Seller</h2>
          <p className="text-gray-500 text-sm">Sell your products to the community.</p>
        </Link>

        <Link to="/admin-login" className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-transparent hover:border-purple-500 text-center">
          <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Admin</h2>
          <p className="text-gray-500 text-sm">Manage the platform.</p>
        </Link>
      </div>
    </div>
  </div>
);

const OrderSuccessPage = () => <PlaceholderPage title="Order Success" description="Show order number and CTA to track order." />;
const ProfilePage = () => <PlaceholderPage title="Profile" description="Profile hub with cards and logout." />;
const AccountSettingsPage = () => <PlaceholderPage title="Account Settings" description="Edit profile, change password." />;
const AddressesPage = () => <PlaceholderPage title="Addresses" description="Manage shipping addresses with default flag." />;
const PaymentMethodsPage = () => <PlaceholderPage title="Payment Methods" description="Cards and GCash linking." />;
const HelpSupportPage = () => <PlaceholderPage title="Help & Support" description="FAQ, contact form, live chat placeholder." />;
const AdminDashboard = () => <PlaceholderPage title="Admin Dashboard" description="Platform overview and analytics." />;
const AdminUsersPage = () => <PlaceholderPage title="Admin Users" description="Manage users, verify sellers." />;
const AdminProductsPage = () => <PlaceholderPage title="Admin Products" description="Moderate products and stock." />;
const AdminOrdersPage = () => <PlaceholderPage title="Admin Orders" description="Oversee platform orders and disputes." />;

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/login-hub" element={<LoginHub />} />
        <Route path="/buyer-login" element={<LoginPage role="buyer" title="Buyer Login" />} />
        <Route path="/seller-login" element={<LoginPage role="seller" title="Seller Login" />} />
        <Route path="/admin-login" element={<LoginPage role="admin" title="Admin Login" />} />
        <Route path="/buyer-register" element={<RegisterPage role="buyer" title="Buyer Registration" />} />
        <Route path="/seller-register" element={<RegisterPage role="seller" title="Seller Registration" />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="buyer">
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="buyer">
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute role="buyer">
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account-settings"
          element={
            <ProtectedRoute>
              <AccountSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-methods"
          element={
            <ProtectedRoute>
              <PaymentMethodsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/help-support" element={<HelpSupportPage />} />

        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute role="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-products"
          element={
            <ProtectedRoute role="admin">
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-orders"
          element={
            <ProtectedRoute role="admin">
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/vouchers" element={<VouchersPage />} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/seller-store/:sellerId" element={<SellerStorePage />} />
        <Route path="/compare" element={<ProductComparePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;