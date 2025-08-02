import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Simpan token dan user ke localStorage saat berubah
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');

    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [token, user]);

  const login = async (nip, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post('/api/auth/login', { nip, password });
      setUser(res.data.user);
      setToken(res.data.token);
      setLoading(false);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login gagal');
      setLoading(false);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = { user, token, loading, error, login, logout, setUser, setToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
