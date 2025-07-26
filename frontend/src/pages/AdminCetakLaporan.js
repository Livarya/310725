import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPrint, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminCetakLaporan = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [laporan, setLaporan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'BERITA ACARA - Bapenda Kota Bandung';
    axios.get(`/api/laporan/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setLaporan(res.data))
      .catch(() => setLaporan(null));
    // Kembalikan title jika keluar dari halaman
    return () => { document.title = 'BERITA ACARA'; };
  }, [id, token]);

  const handlePrint = () => {
    window.print();
  };

  if (!laporan) return <div>Loading...</div>;

  // Siapkan array foto
  const fotoArr = Array.isArray(laporan.foto) ? laporan.foto : laporan.foto ? [laporan.foto] : [];

  // Fungsi untuk memisahkan NPWPD ke dalam kotak-kotak
  const renderNPWPDBoxes = (npwpd) => {
    const digits = npwpd ? npwpd.toString().split('') : [];
    const boxes = [];
    
    for (let i = 0; i < 10; i++) {
      boxes.push(
        <div key={i} style={{
          width: '25px',
          height: '30px',
          border: '1px solid #000',
          display: 'inline-block',
          textAlign: 'center',
          lineHeight: '30px',
          marginRight: '2px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {digits[i] || ''}
        </div>
      );
    }
    return boxes;
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      color: '#000'
    }}>
      {/* Header Controls */}
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#6b7280',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaArrowLeft size={16} /> Kembali
        </button>
        <button
          onClick={handlePrint}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaPrint size={16} /> Cetak BERITA ACARA
        </button>
      </div>

      {/* Template Berita Acara - Halaman Pertama */}
      <div style={{ 
        padding: '40px',
        backgroundColor: '#fff',
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto 20px auto',
        boxSizing: 'border-box'
      }} className="halaman-pertama">
        {/* Header Instansi */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <img src="/assets/logo.png" alt="Logo" style={{ height: '60px', marginRight: '18px' }} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <h1 style={{ 
              margin: '0',
              fontSize: '18px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              PEMERINTAH KOTA BANDUNG
            </h1>
            <h2 style={{ 
              margin: '5px 0',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              BADAN PENGELOLAAN PENDAPATAN DAERAH
            </h2>
            <p style={{ 
              margin: '5px 0',
              fontSize: '12px'
            }}>
              Jl. Wastukencana No. 2 Telp. (022) 422 2323 - Bandung
            </p>
          </div>
        </div>

        {/* Judul Berita Acara */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ 
            margin: '0',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textDecoration: 'underline'
          }}>
            BERITA ACARA
          </h3>
        </div>

        {/* Paragraf Pembuka */}
        <div style={{ marginBottom: '25px', textAlign: 'justify', lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 15px 0', fontSize: '12px' }}>
            Yang bertanda tangan di bawah ini:
          </p>
          
          <div style={{ display: 'flex', gap: '40px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                <strong>Nama</strong> : {user?.nama || '_________________________________'}
              </p>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                <strong>NIP</strong> : {user?.nip || '_________________________________'}
              </p>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                <strong>Jabatan</strong> : {user?.jabatan || '_________________________________'}
              </p>
            </div>
          </div>

          <p style={{ margin: '0 0 15px 0', fontSize: '12px' }}>
            Selanjutnya disebut sebagai <strong>PETUGAS</strong>, telah melakukan pemeriksaan pada:
          </p>
        </div>

        {/* Data Objek Pemeriksaan */}
        <div style={{ marginBottom: '25px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <tbody>
              <tr>
                <td style={{ width: '35%', padding: '5px 0', verticalAlign: 'top' }}>
                  <strong>Nama Merk Dagang</strong>
                </td>
                <td style={{ width: '5%', padding: '5px 0' }}>:</td>
                <td style={{ width: '60%', padding: '5px 0', borderBottom: '1px solid #000' }}>
                  {laporan.nama_merk}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '5px 0', verticalAlign: 'top' }}>
                  <strong>Alamat Merk Dagang</strong>
                </td>
                <td style={{ padding: '5px 0' }}>:</td>
                <td style={{ padding: '5px 0', borderBottom: '1px solid #000' }}>
                  {laporan.alamat}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '5px 0', verticalAlign: 'top' }}>
                  <strong>NPWPD</strong>
                </td>
                <td style={{ padding: '5px 0' }}>:</td>
                <td style={{ padding: '5px 0', borderBottom: '1px solid #000' }}>
                  {renderNPWPDBoxes(laporan.npwpd)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Hasil Pemeriksaan */}
        <div style={{ marginBottom: '25px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 'bold' }}>
            HASIL PEMERIKSAAN:
          </p>
          <div style={{
            border: '1px solid #000',
            padding: '15px',
            minHeight: '120px',
            fontSize: '12px',
            lineHeight: '1.5'
          }}>
            {laporan.hasil_pemeriksaan}
          </div>
        </div>

        {/* Penutup */}
        <div style={{ marginBottom: '25px', textAlign: 'justify', lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 15px 0', fontSize: '12px' }}>
            Berita acara ini dibuat dengan sebenarnya dan dapat dipergunakan sebagaimana mestinya.
          </p>
        </div>

        {/* Tanda Tangan */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '40px'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ margin: '0 0 50px 0', fontSize: '12px' }}>
              Penanggung Jawab,
            </p>
          </div>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ margin: '0 0 50px 0', fontSize: '12px' }}>
              Petugas Pendata 1,
            </p>
          </div>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ margin: '0 0 50px 0', fontSize: '12px' }}>
              Petugas Pendata 2,
            </p>
          </div>
        </div>

        {/* Tanggal */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{ margin: '0', fontSize: '12px' }}>
            Bandung, _____ _______________ 20__
          </p>
        </div>
      </div>

      {/* Halaman Kedua - Dokumentasi Foto */}
      {fotoArr.length > 0 && (
        <div style={{ 
          padding: '40px',
          backgroundColor: '#fff',
          minHeight: '297mm',
          width: '210mm',
          margin: '0 auto',
          boxSizing: 'border-box'
        }} className="halaman-kedua">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
            <img src="/assets/logo.png" alt="Logo" style={{ height: '60px', marginRight: '18px' }} />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <h1 style={{ 
                margin: '0',
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                PEMERINTAH KOTA BANDUNG
              </h1>
              <h2 style={{ 
                margin: '5px 0',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                BADAN PENGELOLAAN PENDAPATAN DAERAH
              </h2>
              <p style={{ 
                margin: '5px 0',
                fontSize: '12px'
              }}>
                Jl. Wastukencana No. 2 Telp. (022) 422 2323 - Bandung
              </p>
            </div>
          </div>

          {/* Foto besar, maksimal 2 per halaman */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
          }}>
            {fotoArr.map((foto, idx) => (
              <div
                key={idx}
                style={{
                  pageBreakAfter: (idx % 2 === 1 || idx === fotoArr.length - 1) ? 'always' : 'auto',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}
              >
                <img
                  src={`http://localhost:5000/uploads/${foto}`}
                  alt={`Foto ${idx + 1}`}
                  style={{
                    width: 'auto',
                    height: '22cm', // Hampir penuh A4 portrait
                    maxWidth: '100%',
                    objectFit: 'contain',
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
                <p style={{ fontSize: '12px', margin: 0 }}>Foto {idx + 1}</p>
              </div>
            ))}
          </div>
          <div style={{marginTop:40, color:'#888', fontSize:12, textAlign:'center', display:'block'}}>
            <strong>Tips:</strong> Untuk hasil cetak terbaik, matikan opsi "Headers and footers" di pengaturan print browser Anda.
          </div>
        </div>
      )}

      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4 portrait;
          }
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          button { 
            display: none !important; 
          }
          div { 
            background: white !important; 
            box-shadow: none !important; 
          }
          * { 
            color: black !important; 
          }
          .halaman-pertama {
            padding: 40px !important;
            page-break-after: always !important;
            break-after: page !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
          }
          .halaman-kedua {
            padding: 40px !important;
            page-break-before: always !important;
            break-before: page !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminCetakLaporan; 