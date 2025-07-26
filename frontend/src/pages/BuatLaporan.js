import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Titik pusat area geo-fencing (misal: Bandung)
const GEO_CENTER = { lat: -6.911303, lng:  107.610311};
const GEO_RADIUS_M = 5000; // 5 km

function haversine(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const BuatLaporan = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_merk: '',
    alamat: '',
    npwpd: '',
    hasil_pemeriksaan: '',
    foto: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locError, setLocError] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);

  React.useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocError('Geolocation tidak didukung browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocError('');
      },
      (err) => {
        setLocError('Gagal mengambil lokasi: ' + err.message);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (formData.npwpd.length !== 13 || !/^\d{13}$/.test(formData.npwpd)) {
      setError('NPWPD harus 13 digit angka!');
      setLoading(false);
      return;
    }
    if (!location.lat || !location.lng) {
      setError('Lokasi tidak tersedia. Pastikan GPS aktif dan izinkan akses lokasi.');
      setLoading(false);
      return;
    }
    // Geo-fencing validation
    const distance = haversine(location.lat, location.lng, GEO_CENTER.lat, GEO_CENTER.lng);
    if (distance > GEO_RADIUS_M) {
      setError('Anda berada di luar area yang diizinkan untuk membuat laporan.');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('nama_merk', formData.nama_merk);
    data.append('alamat', formData.alamat);
    data.append('npwpd', formData.npwpd);
    data.append('hasil_pemeriksaan', formData.hasil_pemeriksaan);
    for (let i = 0; i < formData.foto.length; i++) {
      data.append('foto', formData.foto[i]);
    }
    data.append('latitude', location.lat);
    data.append('longitude', location.lng);

    try {
      await axios.post('/api/laporan', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'foto') {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, foto: files });
      // Generate preview URLs
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  return (
    <Layout title="Buat Laporan Baru">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
          </div>
        )}
        {locError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {locError}
          </div>
        )}
        {/* <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px' }}>
            Lokasi (Latitude, Longitude)
          </label>
          <input
            type="text"
            value={location.lat && location.lng ? `${location.lat}, ${location.lng}` : 'Mengambil lokasi...'}
            readOnly
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px'
            }}
          />
        </div> */}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#fff',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Nama Merk
            </label>
            <input
              type="text"
              name="nama_merk"
              value={formData.nama_merk}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#fff',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Alamat
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                minHeight: '40px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#fff',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              NPWPD
            </label>
            <input
              type="text"
              name="npwpd"
              value={formData.npwpd}
              onChange={e => {
                if (/^\d{0,13}$/.test(e.target.value)) handleChange(e);
              }}
              required
              minLength={13}
              maxLength={13}
              pattern="\d{13}"
              title="NPWPD harus 13 digit angka"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#fff',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Hasil Pemeriksaan
            </label>
            <textarea
              name="hasil_pemeriksaan"
              value={formData.hasil_pemeriksaan}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              color: '#fff',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Foto Dokumentasi
            </label>
            <input
              type="file"
              name="foto"
              onChange={handleChange}
              multiple
              accept="image/*"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            {/* Preview Foto */}
            {previewUrls.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 12 }}>
                {previewUrls.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => { setShowPreview(true); setPreviewIdx(idx); }}>
                    <img src={url} alt={`preview-${idx}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.9)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? '0.7' : '1',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Mengirim...' : 'Kirim Laporan'}
          </button>
        </form>
      </div>
      {/* Lightbox Preview */}
      {showPreview && previewUrls.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowPreview(false)}>
          <img
            src={previewUrls[previewIdx]}
            alt={`preview-big-${previewIdx}`}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 12,
              boxShadow: '0 4px 32px #0008',
              background: '#fff'
            }}
          />
        </div>
      )}
    </Layout>
  );
};

export default BuatLaporan;