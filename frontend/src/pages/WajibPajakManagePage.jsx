import { useEffect, useState } from 'react';
import api from '../config/api';
import SuperAdminLayout from '../components/SuperAdminLayout';
import './WajibPajakManagePage.css';

const WajibPajakManagePage = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('semua');
  const [selectedIds, setSelectedIds] = useState([]);
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/wajibpajak/semua');
      setData(res.data);
    } catch (err) {
      alert('Gagal mengambil data.');
    }
  };

  const filteredData = data.filter((item) =>
    filter === 'semua' ? true : item.status === filter
  );

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleUpdate = async (id, updatedFields) => {
    try {
      await api.put(`/wajibpajak/${id}`, updatedFields);
      fetchData();
    } catch {
      alert('Gagal mengupdate data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await api.delete(`/wajibpajak/${id}`);
      fetchData();
    } catch {
      alert('Gagal menghapus data');
    }
  };

  const handleBlast = async () => {
    if (!customMessage || selectedIds.length === 0) {
      alert('Pilih minimal 1 data dan isi pesan terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/wajibpajak/blast', {
        ids: selectedIds,
        message: customMessage,
      });
      alert(res.data.message);
    } catch {
      alert('Gagal mengirim pesan WA.');
    }
    setLoading(false);
  };

  return (
    <SuperAdminLayout>
      <div className="container">
        <h2>Manajemen Wajib Pajak</h2>

        <div className="filter">
          <label>Filter Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="semua">Semua</option>
            <option value="belum">Belum</option>
            <option value="sudah">Sudah</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Pilih</th>
              <th>Nama</th>
              <th>NPWP</th>
              <th>WA</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="6">Tidak ada data.</td>
              </tr>
            )}
            {filteredData.map((d) => (
              <tr key={d._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(d._id)}
                    onChange={() => handleCheckboxChange(d._id)}
                  />
                </td>
                <td>{d.nama}</td>
                <td>{d.npwp}</td>
                <td>
                  <input
                    type="text"
                    value={d.nomor_wa}
                    onChange={(e) =>
                      handleUpdate(d._id, { nomor_wa: e.target.value })
                    }
                  />
                </td>
                <td>
                  <select
                    value={d.status}
                    onChange={(e) =>
                      handleUpdate(d._id, { status: e.target.value })
                    }
                  >
                    <option value="belum">Belum</option>
                    <option value="sudah">Sudah</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(d._id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="blast-section">
          <textarea
            placeholder="Pesan custom untuk WA..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          ></textarea>
          <button onClick={handleBlast} disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim WA ke yang Dipilih'}
          </button>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default WajibPajakManagePage;
