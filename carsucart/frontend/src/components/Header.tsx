import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Heart, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  onNotificationsClick?: () => void;
};

const Header: React.FC<Props> = ({ onNotificationsClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to={user?.role === 'seller' ? '/seller-dashboard' : user?.role === 'admin' ? '/admin-dashboard' : '/home'} className="flex items-center gap-2 font-semibold text-primary">
          <span className="text-lg">CarSUcart</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/wishlist" className="btn-ghost px-3 py-2">
            <Heart className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="btn-ghost px-3 py-2">
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <button className="btn-ghost px-3 py-2" onClick={onNotificationsClick}>
            <Bell className="h-5 w-5" />
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary/20 grid place-items-center font-semibold text-primary">
                {user.name?.[0] ?? 'U'}
              </div>
              <div className="text-sm leading-tight">
                <div className="font-semibold">{user.name}</div>
                <div className="text-gray-500 capitalize">{user.role}</div>
              </div>
              <button className="btn-ghost px-3 py-2" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login-hub" className="btn-primary">
              <User className="mr-2 h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

