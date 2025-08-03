import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { FaPaperPlane } from 'react-icons/fa';
import './BlastWhatsapp.css';
import SuperAdminLayout from '../components/SuperAdminLayout';

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#1a1f33',
    borderColor: '#00ffaa',
    color: '#fff',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#1a1f33',
    color: '#fff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#00ffaa' : '#1a1f33',
    color: state.isFocused ? '#000' : '#fff',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#00ffaa',
    color: '#000',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#000',
  }),
};

const BlastWhatsapp = () => {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/users');
        const options = res.data.map(user => ({
          value: user.whatsappNumber,
          label: `${user.nama} (${user.whatsappNumber})`
        }));
        setUsers(options);
      } catch (err) {
        toast.error('Gagal mengambil data pengguna');
      }
    };
    fetchUsers();
  }, []);

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users);
    }
  };

  const handleBlast = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.warn('Pesan tidak boleh kosong');
      return;
    }
    if (selectedUsers.length === 0) {
      toast.warn('Pilih minimal satu pengguna');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        message: message.trim(),
        numbers: selectedUsers.map(user => user.value),
      };
      const res = await api.post('/api/whatsapp/blast', payload);
      toast.success(res.data.message || 'Pesan berhasil dikirim');
      setMessage('');
      setSelectedUsers([]);
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan saat mengirim pesan';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminLayout title="Blast WhatsApp">
      <div className="blast-container">
        <h1 className="blast-title">Kirim Pesan WhatsApp Massal</h1>
        <form onSubmit={handleBlast} className="blast-form">
          <div className="form-group">
            <label className="form-label">Pilih Pengguna</label>
            <div className="select-wrapper">
              <Select
                options={users}
                isMulti
                value={selectedUsers}
                onChange={setSelectedUsers}
                placeholder="Cari dan pilih pengguna..."
                classNamePrefix="react-select"
                styles={customStyles}
              />
              <button
                type="button"
                onClick={handleSelectAll}
                className="btn-select-all"
              >
                {selectedUsers.length === users.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pesan WhatsApp</label>
            <textarea
              className="textarea"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan yang ingin dikirim..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-submit ${loading ? 'btn-disabled' : ''}`}
          >
            <FaPaperPlane style={{ marginRight: '8px' }} />
            {loading ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </form>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </SuperAdminLayout>
  );
};

export default BlastWhatsapp;
