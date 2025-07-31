// backend/models/User.js
const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  nip: { type: String, required: true, unique: true },
  whatsappNumber: { type: String, required: true },
  nama: { type: String, required: true },
  jabatan: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  status: { type: String, enum: ['aktif', 'nonaktif'], default: 'aktif' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
