require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inisialisasi WhatsApp client
console.log('Menginisialisasi WhatsApp client untuk notifikasi...');
try {
  const { initWhatsApp } = require('./config/whatsapp');
  initWhatsApp();
} catch (err) {
  console.log('WhatsApp init error (non-critical):', err.message);
}

// Routes - Load one by one with error handling
try {
  console.log('Loading auth routes...');
  app.use('/api/auth', require('./routes/auth'));
} catch (err) {
  console.error('ERROR in auth routes:', err.message);
}

try {
  console.log('Loading users routes...');
  app.use('/api/users', require('./routes/users'));
} catch (err) {
  console.error('ERROR in users routes:', err.message);
}

try {
  console.log('Loading laporan routes...');
  app.use('/api/laporan', require('./routes/laporan'));
} catch (err) {
  console.error('ERROR in laporan routes:', err.message);
}

try {
  console.log('Loading admin routes...');
  app.use('/api/admin', require('./routes/admin'));
} catch (err) {
  console.error('ERROR in admin routes:', err.message);
}

try {
  console.log('Loading superadmin routes...');
  const superadminRoutes = require('./routes/superadmin');
  app.use('/api/superadmin', superadminRoutes);
} catch (err) {
  console.error('ERROR in superadmin routes:', err.message);
}

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Tambahkan error handler global
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR HANDLER:', err.stack || err);
  res.status(500).json({ msg: 'Server error', error: err.message });
});