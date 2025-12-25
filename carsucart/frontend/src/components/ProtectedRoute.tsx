import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  children: React.ReactNode;
  role?: 'buyer' | 'seller' | 'admin';
};

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login-hub" replace />;
  }

  if (role && user.role !== role) {
    const fallback =
      user.role === 'buyer' ? '/home' : user.role === 'seller' ? '/seller-dashboard' : '/admin-dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

