const { client } = require('../config/whatsapp');

// Fungsi bantu untuk ubah nomor 08 ➜ 62
const formatNumber = (no) => {
  if (no.startsWith('0')) return '62' + no.slice(1);
  if (no.startsWith('+')) return no.replace('+', '');
  return no;
};

exports.sendBlastMessage = async (req, res) => {
  const { message, numbers } = req.body;

  if (!message || !Array.isArray(numbers) || numbers.length === 0) {
    return res.status(400).json({ message: 'Pesan dan daftar nomor wajib diisi.' });
  }

  const failed = [];

  for (const no of numbers) {
    const raw = formatNumber(no); // pastikan format nomor benar
    const number = raw.includes('@c.us') ? raw : `${raw}@c.us`;

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
