import React, { useEffect, useRef, useState } from 'react';
import api from '../config/api';

export default function FaceVerification() {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/api/face', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
       // sudah /api dari baseURL
      setRegistered(res.data.registered);
    } catch (err) {
      console.error('Gagal memuat status wajah:', err);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert('Gagal mengakses kamera');
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const scale = 0.5; // resize jadi 50% biar lebih kecil
    canvas.width = videoRef.current.videoWidth * scale;
    canvas.height = videoRef.current.videoHeight * scale;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.7); // kualitas 70%
  };
  

  const handleRegister = async () => {
    setCapturing(true);
    const imageData = captureImage();
    try {
      await api.post('/api/face/register', { image: imageData }); // sudah /api dari baseURL
      alert('Wajah berhasil disimpan!');
      fetchStatus();
    } catch (err) {
      console.error('Gagal menyimpan wajah:', err);
      alert('Gagal menyimpan wajah');
    } finally {
      setCapturing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    startCamera();
  }, []);

  if (loading) return <p>Memuat...</p>;

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
      <h3>Verifikasi Wajah</h3>
      {registered ? (
        <p>✅ Wajah sudah terverifikasi</p>
      ) : (
        <p>❌ Wajah belum terdaftar</p>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', borderRadius: '8px', marginTop: '1rem' }}
      />

      <button
        onClick={handleRegister}
        disabled={capturing}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {registered ? 'Update Wajah' : 'Daftarkan Wajah'}
      </button>
    </div>
  );
}
