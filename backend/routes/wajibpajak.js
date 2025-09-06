const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const router = express.Router();
const controller = require('../controllers/WajibPajakController');
const WajibPajak = require('../models/WajibPajak');

// Setup multer (pakai memory storage supaya file tidak perlu disimpan ke disk)
const upload = multer({ storage: multer.memoryStorage() });

// Routes utama
router.post('/tambah', controller.tambahWajibPajak);
router.get('/semua', controller.getSemuaWajibPajak);
router.get('/belum', controller.getBelumLapor);
router.get('/sudah', controller.getSudahLapor);
router.post('/blast', controller.kirimWaBlast);

// Update
router.put('/:id', (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
}, controller.updateWajibPajak);

// Delete
router.delete('/:id', (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
}, controller.deleteWajibPajak);

// Import dari Excel
// Import dari Excel
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File tidak ditemukan' });
    }

    // Baca buffer Excel
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data untuk diimport' });
    }

    // Mapping field agar sesuai schema MongoDB
    const mappedData = data.map((row) => ({
      nama: row.nama || row.NAMA || '',
      npwp: row.npwp || row.NPWP || '',
      nomor_wa: row.nomor_wa || row.NO_WA || row['NO WA'] || row.nomorWA || '',
      status: (row.status || row.STATUS || '').toLowerCase() === 'sudah' ? 'sudah' : 'belum',
    }));

    if (mappedData.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data valid untuk diimport' });
    }

    await WajibPajak.insertMany(mappedData);

    res.json({
      success: true,
      message: 'Data berhasil diimport',
      count: mappedData.length,
    });
  } catch (error) {
    console.error('Error import:', error);
    res.status(500).json({ success: false, message: 'Gagal import data' });
  }
});
module.exports = router;
