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
      // Fix: Add /api prefix
      const res = await api.get('/api/wajibpajak/semua');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
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
      // Fix: Add /api prefix
      await api.post('/api/wajibpajak/tambah', form);
      alert('Wajib Pajak berhasil ditambahkan!');
      setForm({ nama: '', npwp: '', nomor_wa: '', status: 'belum' });
      fetchData();
    } catch (err) {
      console.error('Error adding data:', err);
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
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-text">Belum ada data wajib pajak</div>
                </td>
              </tr>
            ) : (
              data.map((d, i) => (
                <tr key={d._id || i} className="slide-in-up">
                  <td>{d.nama}</td>
                  <td>{d.npwp}</td>
                  <td>{d.nomor_wa}</td>
                  <td>
                    <span className={`status-badge status-${d.status}`}>
                      {d.status === 'sudah' ? '✅ Sudah' : '⏳ Belum'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </SuperAdminLayout>
  );
};

export default WajibPajakPage;