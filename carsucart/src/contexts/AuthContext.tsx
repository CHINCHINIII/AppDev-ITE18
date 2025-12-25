import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';

type UserRole = 'buyer' | 'seller' | 'admin' | null;

interface Address {
  id: string;
  name: string;
  phone: string;
  building: string;
  room?: string;
  notes?: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'gcash' | 'paymaya' | 'card' | 'bank';
  name: string;
  details: string;
  isDefault: boolean;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  shopName?: string;
  phone?: string;
  studentId?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  deletePaymentMethod: (id: string) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/user');
      // Ensure backend returns the expected user structure. 
      // If backend returns { data: user }, use response.data.data
      const userData = response.data.data || response.data;
      setUser({
          ...userData,
          // Initialize empty arrays if backend doesn't provide them yet
          addresses: userData.addresses || [], 
          paymentMethods: userData.paymentMethods || [] 
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // If token is invalid, logout
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      // Backend returns: { success: true, data: { access_token: "...", user: { ... } } }
      const { access_token, user: userData } = response.data.data;
      
      localStorage.setItem('token', access_token);
      
      const completeUser = {
          ...userData,
          addresses: userData.addresses || [],
          paymentMethods: userData.paymentMethods || []
      };

      // Update user state
      setUser(completeUser);
      
      return Promise.resolve(completeUser);
    } catch (error: any) {
      console.error('Login error:', error);
      
      let message = error.response?.data?.message || 'Login failed';
      
      // If there are specific validation errors, append them
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat().join(', ');
        if (validationErrors) {
          message = `${message}: ${validationErrors}`;
        }
      }
      
      toast.error(message);
      return Promise.reject(message);
    }
  };

  const register = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword, // Map to Laravel expectation
        role: data.role,
        contact_no: data.phone, // Map phone to contact_no
        store_name: data.shopName // Map shopName to store_name
      };

      const response = await api.post('/register', payload);
      // Backend returns: { success: true, data: { access_token: "...", user: { ... } } }
      const { access_token, user: userData } = response.data.data;
      
      localStorage.setItem('token', access_token);
      setUser({
          ...userData,
          addresses: [],
          paymentMethods: []
      });
      
      return Promise.resolve();
    } catch (error: any) {
       console.error('Registration error:', error);
       
       let message = error.response?.data?.message || 'Registration failed';
       
       // If there are specific validation errors, append them
       if (error.response?.data?.errors) {
         const validationErrors = Object.values(error.response.data.errors).flat().join(', ');
         if (validationErrors) {
           message = `${message}: ${validationErrors}`;
         }
       }
       
       toast.error(message);
       return Promise.reject(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      // Optimistic update
      setUser({ ...user, ...data });
      // TODO: Call API to update profile
      // api.put('/profile', data).catch(...)
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress: Address = {
        ...address,
        id: `addr-${Date.now()}`
      };
      
      // If this is set as default, unset all others
      const addresses = address.isDefault
        ? [...(user.addresses || []).map(a => ({ ...a, isDefault: false })), newAddress]
        : [...(user.addresses || []), newAddress];
      
      setUser({ ...user, addresses });
    }
  };

  const updateAddress = (id: string, addressData: Partial<Address>) => {
    if (user && user.addresses) {
      const addresses = user.addresses.map(addr => {
        if (addr.id === id) {
          return { ...addr, ...addressData };
        }
        // If we're setting a new default, unset others
        if (addressData.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });
      setUser({ ...user, addresses });
    }
  };

  const deleteAddress = (id: string) => {
    if (user && user.addresses) {
      setUser({
        ...user,
        addresses: user.addresses.filter(addr => addr.id !== id)
      });
    }
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    if (user) {
      const newMethod: PaymentMethod = {
        ...method,
        id: `pm-${Date.now()}`
      };
      
      const paymentMethods = method.isDefault
        ? [...(user.paymentMethods || []).map(pm => ({ ...pm, isDefault: false })), newMethod]
        : [...(user.paymentMethods || []), newMethod];
      
      setUser({ ...user, paymentMethods });
    }
  };

  const deletePaymentMethod = (id: string) => {
    if (user && user.paymentMethods) {
      setUser({
        ...user,
        paymentMethods: user.paymentMethods.filter(pm => pm.id !== id)
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      addPaymentMethod,
      deletePaymentMethod,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}