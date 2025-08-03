const { client } = require('../config/whatsapp'); // pastikan ini sesuai
// client ini harus berasal dari whatsapp-web.js yang sudah login QR Code

exports.sendBlastMessage = async (req, res) => {
  const { message, numbers } = req.body;

  if (!message || !Array.isArray(numbers) || numbers.length === 0) {
    return res.status(400).json({ message: 'Pesan dan daftar nomor wajib diisi.' });
  }

  const failed = [];

  for (const no of numbers) {
    const number = no.includes('@c.us') ? no : `${no}@c.us`;

    try {
      await client.sendMessage(number, message);
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

  return res.json({ message: 'Pesan berhasil dikirim ke semua nomor.' });
};
