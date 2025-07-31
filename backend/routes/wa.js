// routes/wa.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { blastMessage } = require('../config/whatsapp');

router.post('/blast', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ msg: 'Pesan wajib diisi' });

  try {
    const users = await User.find({ whatsappNumber: { $ne: null } });
    const formattedUsers = users.map(u => ({ name: u.nama, phone: u.whatsappNumber }));

    console.log('🚀 Mengirim blast ke:', formattedUsers); // ✅ Tambahkan ini
    console.log('📨 Isi pesan:', message);

    await blastMessage(formattedUsers, message); // ← fungsi utama

    res.json({ msg: 'Blast WhatsApp selesai dikirim' });
  } catch (err) {
    console.error('❌ ERROR saat kirim blast:', err);
    res.status(500).json({ msg: 'Gagal melakukan blast', error: err.message });
  }
});
// GET /api/wa-users
router.get('/wa-users', async (req, res) => {
  try {
    const users = await User.find({ status: 'aktif' }).select('nama whatsappNumber');
    const formatted = users.map(user => ({
      name: user.nama,
      phone: user.whatsappNumber
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Error get wa-users:', err);
    res.status(500).json({ msg: 'Gagal ambil data pengguna' });
  }
});

module.exports = router;
