import { useState, useEffect } from 'react';
import api from '../config/api';
import './wajibpajakpage.css';
import SuperAdminLayout from '../components/SuperAdminLayout';

const WajibPajakPage = () => {
  const [form, setForm] = useState({
    nama: '',
    npwp: '',
    nomor_wa: '',
    status: 'belum',
  });

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get('/wajibpajak/semua');
      setData(res.data);
    } catch (err) {
      alert('Gagal mengambil data wajib pajak.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/wajibpajak/tambah', form);
      alert('Wajib Pajak berhasil ditambahkan!');
      setForm({ nama: '', npwp: '', nomor_wa: '', status: 'belum' });
      fetchData();
    } catch (err) {
      alert('Gagal menambahkan data.');
    }
  };

  return (
    <SuperAdminLayout>
      <div className="container">
        <h2>Input Wajib Pajak</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} required />
          <input name="npwp" placeholder="NPWP" value={form.npwp} onChange={handleChange} required />
          <input name="nomor_wa" placeholder="Nomor WhatsApp" value={form.nomor_wa} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="belum">Belum</option>
            <option value="sudah">Sudah</option>
          </select>
          <button type="submit">Tambah</button>
        </form>

        <h3>Daftar Wajib Pajak</h3>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Nama</th>
              <th>NPWP</th>
              <th>No WA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr><td colSpan="4">Belum ada data.</td></tr>
            )}
            {data.map((d, i) => (
              <tr key={i}>
                <td>{d.nama}</td>
                <td>{d.npwp}</td>
                <td>{d.nomor_wa}</td>
                <td>{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SuperAdminLayout>
  );
};

export default WajibPajakPage;
