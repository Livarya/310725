const WajibPajak = require('../models/WajibPajak');
const { client } = require('../config/whatsapp');

// Tambah data wajib pajak
exports.tambahWajibPajak = async (req, res) => {
  try {
    const data = await WajibPajak.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil semua data wajib pajak
exports.getSemuaWajibPajak = async (req, res) => {
  try {
    const data = await WajibPajak.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil yang belum lapor
exports.getBelumLapor = async (req, res) => {
  try {
    const data = await WajibPajak.find({ status: 'belum' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fungsi bantu format nomor WA
const formatNumber = (no) => {
  if (no.startsWith('0')) return '62' + no.slice(1);
  if (no.startsWith('+')) return no.replace('+', '');
  return no;
};

// Kirim pesan WA blast
exports.kirimWaBlast = async (req, res) => {
    try {
      const { message, ids } = req.body;
  
      if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Tidak ada data yang dipilih.' });
      }
  
      const data = await WajibPajak.find({ _id: { $in: ids } });
      const numbers = data.map(d => d.nomor_wa);
  
      const failed = [];
  
      for (const no of numbers) {
        const raw = formatNumber(no);
        const number = raw.includes('@c.us') ? raw : `${raw}@c.us`;
  
        try {
          await client.sendMessage(number, message || 'Halo, Anda belum melaporkan pajak. Harap segera melapor.');
        } catch (err) {
          console.error(`Gagal kirim ke ${number}:`, err.message);
          failed.push(no);
        }
      }
  
      if (failed.length > 0) {
        return res.status(207).json({
          message: `Beberapa pesan gagal dikirim ke: ${failed.join(', ')}`,
          failed,
        });
      }
  
      return res.json({ message: 'Pesan berhasil dikirim ke semua nomor yang dipilih.' });
    } catch (err) {
      console.error('Error kirim WA blast:', err.message);
      return res.status(500).json({ message: err.message });
    }
  };

// Contoh fungsi update
exports.updateWajibPajak = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      const updated = await WajibPajak.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updated) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
      }
  
      res.json({ message: 'Berhasil mengupdate data', data: updated });
    } catch (error) {
      console.error('Gagal update:', error);
      res.status(500).json({ message: 'Gagal mengupdate data', error });
    }
  };
  
  // Hapus Wajib Pajak
  exports.deleteWajibPajak = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleted = await WajibPajak.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
      }
  
      res.json({ message: 'Berhasil menghapus data', data: deleted });
    } catch (error) {
      console.error('Gagal hapus:', error);
      res.status(500).json({ message: 'Gagal menghapus data', error });
    }
  };
  
 
  
  exports.getSudahLapor = async (req, res) => {
    const sudah = await WajibPajak.find({ status: 'sudah' });
    res.json(sudah);
  };