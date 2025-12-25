import axios from 'axios';

// Determine API base URL - Use HTTP since Laravel runs on HTTP by default
const getApiBaseURL = () => {
  // Use HTTP for Laravel (php artisan serve runs on HTTP)
  // Change to https://localhost:8000/api if you configure HTTPS for Laravel
  if (typeof window !== 'undefined') {
    return 'http://localhost:8000/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
      });
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
