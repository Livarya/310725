import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axiosInstance from '../axiosInstance';
import SuperAdminLayout from '../components/SuperAdminLayout';

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
    color: '#000',
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    borderColor: '#ccc',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#888',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#e0e0e0',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#000',
  }),
};

const BlastWhatsapp = () => {
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil data dari backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('http://localhost:5000/api/wa-users');
        const formatted = res.data.map(user => ({
          value: user.phone,
          label: `${user.name} (${user.phone})`
        }));
        setUserOptions(formatted);
      } catch (err) {
        console.error('Gagal ambil nomor:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleBlast = async (e) => {
    e.preventDefault();
    if (!message || selectedUsers.length === 0) {
      setStatus({ success: false, message: 'Isi pesan dan pilih minimal 1 nomor' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await axiosInstance.post('http://localhost:5000/api/blast', {
        message,
        numbers: selectedUsers.map(user => user.value),
      });
      setStatus({ success: true, message: res.data.msg });
    } catch (err) {
      setStatus({
        success: false,
        message: err.response?.data?.msg || 'Gagal mengirim pesan',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    setSelectedUsers(userOptions);
  };

  return (
    <SuperAdminLayout title="Blast WhatsApp">
      <div style={{ padding: '24px', maxWidth: '700px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Kirim Blast WhatsApp</h2>

        <form onSubmit={handleBlast} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label><strong>Pilih Nomor</strong></label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Select
                isMulti
                options={userOptions}
                value={selectedUsers}
                onChange={setSelectedUsers}
                placeholder="Pilih nomor tujuan..."
                styles={customStyles}
                className="react-select-container"
                classNamePrefix="react-select"
              />
              <button
                type="button"
                onClick={handleSelectAll}
                style={{
                  padding: '6px 12px',
                  background: '#0d6efd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Pilih Semua
              </button>
            </div>
          </div>

          <div>
            <label><strong>Pesan</strong></label>
            <textarea
              rows="5"
              placeholder="Tulis pesan yang ingin dikirim..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{ width: '100%', padding: '12px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              background: '#ffffff',
              color: 'black',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
          >
            {loading ? 'Mengirim...' : 'Kirim Pesan'}
          </button>

          {status && (
            <div style={{ color: status.success ? 'green' : 'red' }}>
              {status.message}
            </div>
          )}
        </form>
      </div>
    </SuperAdminLayout>
  );
};

export default BlastWhatsapp;
