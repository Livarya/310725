import axios from 'axios';

// Base URL untuk ngrok backend
const BASE_URL = process.env.REACT_APP_API_URL || 'https://a32c5d4bbbdb.ngrok-free.app';

console.log('API Base URL:', BASE_URL);

// Export untuk komponen lain yang membutuhkan
export const API_BASE_URL = BASE_URL;

// Buat instance axios dengan konfigurasi untuk ngrok
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Header untuk ngrok (penting!)
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Pastikan header ngrok ada
    config.headers['ngrok-skip-browser-warning'] = 'true';
    
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      headers: {
        'Authorization': config.headers.Authorization ? 'Bearer [TOKEN]' : 'None',
        'ngrok-skip-browser-warning': config.headers['ngrok-skip-browser-warning'],
      },
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      dataLength: JSON.stringify(response.data).length,
    });
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      fullUrl: error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown',
      errorData: error.response?.data,
      message: error.message,
      isNetworkError: !error.response,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.warn('Unauthorized - clearing token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle ngrok specific errors
    if (!error.response && error.message.includes('Network Error')) {
      console.error('Network Error - Check if ngrok backend is running');
    }

    return Promise.reject(error);
  }
);

// Export default sebagai api instance
export default api;

// Export BASE_URL dengan nama lain untuk backward compatibility
export { BASE_URL };
export const baseURL = BASE_URL;