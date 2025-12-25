import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  loginApi,
  logoutApi,
  registerApi,
  resetPasswordApi,
  verifyEmailApi,
} from '../api';
import type { User } from '../types';

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (params: { email: string; password: string; role?: User['role']; remember?: boolean }) => Promise<void>;
  register: (payload: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const persistSession = (data: User, remember?: boolean) => {
    const store = remember ? localStorage : sessionStorage;
    store.setItem('auth_user', JSON.stringify(data));
    if (data.token) {
      store.setItem('auth_token', data.token);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_token');
  };

  const login = async (params: { email: string; password: string; role?: User['role']; remember?: boolean }) => {
    setLoading(true);
    try {
      const res = await loginApi({ email: params.email, password: params.password, role: params.role });
      // Backend returns { success: true, data: { user: ..., access_token: ... } }
      const payload = res.data?.data?.user as User;
      const token = res.data?.data?.access_token as string | undefined;
      const merged: User = { ...payload, token };
      setUser(merged);
      persistSession(merged, params.remember);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await registerApi(payload);
      // Automatically log in after register
      // Backend returns { success: true, data: { user: ..., access_token: ... } }
      const userPayload = res.data?.data?.user as User;
      const token = res.data?.data?.access_token as string | undefined;
      const merged: User = { ...userPayload, token };
      setUser(merged);
      persistSession(merged, true); // Default to remember=true for registration
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutApi();
    } finally {
      clearSession();
      setUser(null);
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Utilities for password reset/verify email that UIs can call when wired later
export const requestPasswordReset = resetPasswordApi;
export const requestVerifyEmail = verifyEmailApi;

