require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const superadminRoutes = require('./routes/superadmin');
const { initWhatsApp } = require('./config/whatsapp');
const app = express();
const waRoute = require('./routes/wa');
const wajibPajakRoutes = require('./routes/wajibpajak');

connectDB();

// CORS configuration untuk ngrok frontend dan backend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}));


app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('Menginisialisasi WhatsApp client untuk notifikasi...');
initWhatsApp();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/laporan', require('./routes/laporan'));
app.use('/api/superadmin', superadminRoutes);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/whatsapp', waRoute);
app.use('/wajibpajak', wajibPajakRoutes); // atau sesuai nama file


app.get('/', (req, res) => {
  res.send('API berjalan dengan baik 🚀');
});
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend connected!',
    timestamp: new Date()
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));

// Global error handler
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR HANDLER:', err.stack || err);
  res.status(500).json({ msg: 'Server error', error: err.message });
});