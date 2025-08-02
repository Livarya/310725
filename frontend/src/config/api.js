// frontend/src/config/api.js
import axios from 'axios';

// Buat base URL yang fleksibel
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://8283a4107674.ngrok-free.app';

// Buat axios instance dengan base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 detik timeout
});

// Interceptor untuk menambahkan token otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default api;