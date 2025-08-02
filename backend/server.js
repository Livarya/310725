// backend/server.js - PASTIKAN IMPORT ADMIN ROUTES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://3c38d6e82d43.ngrok-free.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files untuk uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/siperiksa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes - PASTIKAN SEMUA ADA
app.use('/api/auth', require('./routes/auth'));
app.use('/api/laporan', require('./routes/laporan'));
app.use('/api/admin', require('./routes/admin')); // INI WAJIB ADA!
app.use('/api/users', require('./routes/users'));

// Test route untuk debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend connected successfully!',
    timestamp: new Date().toISOString(),
    routes: [
      '/api/auth',
      '/api/laporan', 
      '/api/admin',
      '/api/users'
    ]
  });
});

// Debug middleware untuk log semua request
app.use('*', (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, {
    headers: req.headers.authorization ? 'Token present' : 'No token',
    body: req.method === 'POST' ? req.body : 'N/A'
  });
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    msg: 'Server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.originalUrl);
  res.status(404).json({ msg: `Route not found: ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
  console.log(`🌐 Test URL: http://localhost:${PORT}/api/test`);
});