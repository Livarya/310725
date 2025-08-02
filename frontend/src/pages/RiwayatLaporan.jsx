// QUICK FIX untuk RiwayatLaporan.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const RiwayatLaporan = () => {
  const { token } = useAuth();
  const [laporan, setLaporan] = useState([]); // PASTIKAN SELALU ARRAY
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchLaporan();
    }
  }, [token]);

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching laporan with token:', token ? 'exists' : 'missing');
      
      const res = await axios.get('/api/laporan/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Response data:', res.data);
      console.log('Response data type:', typeof res.data);
      console.log('Is array?', Array.isArray(res.data));
      
      // PASTIKAN SELALU SET ARRAY
      if (Array.isArray(res.data)) {
        setLaporan(res.data);
      } else {
        console.error('Response bukan array:', res.data);
        setLaporan([]); // Set empty array jika bukan array
        setError('Data yang diterima tidak valid');
      }
    } catch (err) {
      console.error('Error fetching laporan:', err);
      console.error('Error response:', err.response?.data);
      setError(`Gagal memuat riwayat laporan: ${err.response?.data?.msg || err.message}`);
      setLaporan([]); // PASTIKAN SET EMPTY ARRAY SAAT ERROR
    } finally {
      setLoading(false);
    }
  };

  // Helper function untuk mendapatkan URL foto
  const getFotoUrl = (filename) => {
    if (!filename) return null;
    return `http://localhost:5000/uploads/${filename}`;
  };

  if (loading) {
    return (
      <Layout title="Riwayat Laporan">
        <div style={{ color: '#fff', textAlign: 'center' }}>Memuat data...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Riwayat Laporan">
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          {error}
          <button 
            onClick={fetchLaporan}
            style={{
              marginLeft: '10px',
              padding: '4px 8px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '4px',
              color: '#ef4444',
              cursor: 'pointer'
            }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* PASTIKAN laporan adalah array sebelum render */}
        {!Array.isArray(laporan) || laporan.length === 0 ? (
          <div style={{ 
            color: 'rgba(255,255,255,0.7)', 
            textAlign: 'center', 
            padding: '32px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {error ? 'Gagal memuat data' : 'Belum ada laporan'}
          </div>
        ) : (
          laporan.map(l => (
            <div key={l._id || Math.random()} style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ flex: 1, color: '#fff' }}>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>
                  {l.nama_merk || 'Nama tidak tersedia'}
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginLeft: '8px' }}>
                    ({l.npwpd || 'NPWPD tidak tersedia'})
                  </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '4px 0' }}>
                  {l.alamat || 'Alamat tidak tersedia'}
                </div>
                <div style={{ fontSize: '13px' }}>
                  <span style={{
                    color: l.status === 'Disetujui' ? '#4ade80' : 
                           l.status === 'Ditolak' ? '#f87171' : '#fbbf24',
                    fontWeight: 600,
                    marginRight: '12px'
                  }}>
                    {l.status || 'Status tidak tersedia'}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {l.tanggal ? new Date(l.tanggal).toLocaleString() : 'Tanggal tidak tersedia'}
                  </span>
                </div>
              </div>
              {Array.isArray(l.foto) && l.foto.length > 0 && l.foto[0] && (
                <div style={{
                  minWidth: '80px',
                  height: '80px',
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <img 
                    src={getFotoUrl(l.foto[0])}
                    alt="foto" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default RiwayatLaporan;