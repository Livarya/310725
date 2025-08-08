const express = require('express');
const router = express.Router();
const controller = require('../controllers/WajibPajakController');

router.post('/tambah', controller.tambahWajibPajak);
router.get('/semua', controller.getSemuaWajibPajak);
router.get('/belum', controller.getBelumLapor);
router.get('/sudah', controller.getSudahLapor);
router.post('/blast', controller.kirimWaBlast);

// Tambahkan validasi untuk parameter routes
router.put('/:id', (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
}, controller.updateWajibPajak);

router.delete('/:id', (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
}, controller.deleteWajibPajak);

module.exports = router;