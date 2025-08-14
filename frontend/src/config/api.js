import axios from 'axios';

// Base URL configuration
export const BASE_URL = 'https://6ef7da3f6f6d.ngrok-free.app';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    
    console.log('🚀 API Request Details:');
    console.log('  Method:', config.method?.toUpperCase());
    console.log('  URL:', config.url);
    console.log('  Base URL:', config.baseURL);
    console.log('  Full URL:', config.baseURL + config.url);
    console.log('  Headers:', JSON.stringify(config.headers, null, 2));
    
    if (config.data) {
      console.log('  Request Body:', JSON.stringify(config.data, null, 2));
      console.log('  Request Body Type:', typeof config.data);
      console.log('  Request Body Keys:', Object.keys(config.data || {}));
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log('🔒 Unauthorized access - clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Instruksi API helpers
export const instruksiAPI = {
  // Get my instructions
  async getMyInstructions() {
    try {
      const response = await api.get('/api/instruksi/me'); // Fixed: added /api prefix
      return {
        success: true,
        data: response.data.data,
        count: response.data.count
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Gagal mengambil instruksi'
      };
    }
  },

  // Get all instructions (admin)
  async getAllInstructions(params = {}) {
    try {
      const response = await api.get('/api/instruksi', { params }); // Fixed: added /api prefix
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Gagal mengambil semua instruksi'
      };
    }
  },

  // Get user instructions (admin)
  async getUserInstructions(userId, params = {}) {
    try {
      const response = await api.get(`/api/instruksi/user/${userId}`, { params }); // Fixed: added /api prefix
      return {
        success: true,
        data: response.data.data,
        count: response.data.count
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Gagal mengambil instruksi user'
      };
    }
  },

  // Create instruction (admin)
  async createInstruction(data) {
    try {
      console.log('📤 Creating instruction with raw data:', JSON.stringify(data, null, 2));
      
      // Validate required fields on client side
      if (!data.instruksi || !data.instruksi.trim()) {
        console.error('❌ Client validation failed: instruksi is empty');
        throw new Error('Instruksi wajib diisi');
      }
      
      if (!data.user || !Array.isArray(data.user) || data.user.length === 0) {
        console.error('❌ Client validation failed: user array is empty');
        throw new Error('Minimal pilih 1 user penerima');
      }
      
      // Log the exact payload being sent
      console.log('📤 Sending POST request to /api/instruksi with payload:', JSON.stringify(data, null, 2));
      
      const response = await api.post('/api/instruksi', data);
      console.log('✅ Instruction created successfully:', response.data);
      
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error creating instruction - Full error:', error);
      console.error('❌ Error response data:', error.response?.data);
      console.error('❌ Error response status:', error.response?.status);
      console.error('❌ Error response headers:', error.response?.headers);
      
      return {
        success: false,
        error: error.response?.data?.message || 
               error.response?.data?.errors?.[0]?.msg ||
               error.message || 
               'Gagal membuat instruksi'
      };
    }
  },

  // Update instruction status
  async updateStatus(instruksiId, status) {
    try {
      const response = await api.put(`/api/instruksi/${instruksiId}/status`, { status }); // Fixed: added /api prefix
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Gagal mengupdate status'
      };
    }
  },

  // Update full instruction (admin)
  async updateInstruction(instruksiId, data) {
    try {
      const response = await api.put(`/api/instruksi/${instruksiId}`, data); // Fixed: added /api prefix
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Gagal mengupdate instruksi'
      };
    }
  },

  // Delete instruction (admin)
  async deleteInstruction(instruksiId) {
    try {
      const response = await api.delete(`/api/instruksi/${instruksiId}`); // Fixed: added /api prefix
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Gagal menghapus instruksi'
      };
    }
  }
};

// Users API helpers
export const usersAPI = {
  // Get all users
  async getAllUsers() {
    try {
      const response = await api.get('/api/users'); // Fixed: added /api prefix
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Gagal mengambil data users'
      };
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await api.get(`/api/users/${userId}`); // Fixed: added /api prefix
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Gagal mengambil data user'
      };
    }
  }
};

// Export additional useful properties
export const baseURL = BASE_URL;
export const apiHelpers = {
  instruksiAPI,
  usersAPI
};

export default api;