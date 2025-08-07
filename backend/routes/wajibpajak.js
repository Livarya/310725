const express = require('express');
const router = express.Router();
const controller = require('../controllers/WajibPajakController');

router.post('/tambah', controller.tambahWajibPajak);
router.get('/semua', controller.getSemuaWajibPajak);
router.get('/belum', controller.getBelumLapor);
router.post('/blast', controller.kirimWaBlast);
router.put('/:id', controller.updateWajibPajak);
router.delete('/:id', controller.deleteWajibPajak);
router.get('/belum', controller.getBelumLapor);
router.get('/sudah', controller.getSudahLapor);

module.exports = router;
