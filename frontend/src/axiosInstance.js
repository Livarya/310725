// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://8283a4107674.ngrok-free.app', // ganti dengan URL ngrok backend kamu
  headers: {
    'Content-Type': 'application/json',
  },
});
    
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  

export default axiosInstance;
