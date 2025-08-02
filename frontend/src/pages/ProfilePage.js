import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const ProfilePage = () => {
  const { user, token, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    whatsappNumber: user?.whatsappNumber || '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axiosInstance.put('/api/users/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setSuccess('Profil berhasil diperbarui');
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.msg || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Profil Saya">
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
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

        {success && (
          <div style={{
            background: 'rgba(74, 222, 128, 0.1)',
            color: '#4ade80',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid rgba(74, 222, 128, 0.2)'
          }}>
            {success}
          </div>
        )}

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#fff',
              fontWeight: '600'
            }}>
              {user?.nama ? user.nama[0].toUpperCase() : '?'}
            </div>
            <div>
              <h3 style={{ color: '#fff', margin: '0 0 4px 0' }}>{user?.nama}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>{user?.email}</p>
              {user?.whatsappNumber && (
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0 0' }}>
                  WA: {user.whatsappNumber}
                </p>
              )}
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%',
                fontSize: '14px'
              }}
            >
              Edit Profil
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#fff',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Nama
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
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
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
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
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="Contoh: 08123456789"
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
                <small style={{ color: 'rgba(255,255,255,0.5)', display: 'block', marginTop: '4px' }}>
                  Untuk menerima notifikasi status laporan via WhatsApp
                </small>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#fff',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
                  Password Baru
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
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

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: '#fff',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.9)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? '0.7' : '1'
                  }}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;