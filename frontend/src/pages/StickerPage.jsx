import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import api from "../config/api";
import "./StickerPage.css";

const StickerPage = () => {
  const { id } = useParams();
  const [wp, setWp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching data for ID:", id);
        
        const res = await api.get(`/api/wajibpajak/${id}`);
        console.log("Response data:", res.data);
        
        setWp(res.data);
      } catch (err) {
        console.error("Gagal ambil data wajib pajak:", err);
        
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data?.message || 'Data tidak ditemukan'}`);
        } else if (err.request) {
          setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
        } else {
          setError("Terjadi kesalahan yang tidak terduga.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError("ID tidak valid");
      setLoading(false);
    }
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
        size: 85mm 54mm;
        margin: 0;
      }
      @media print {
        body { margin: 0; }
        .no-print { display: none !important; }
      }
    `
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading...</p>
        <p className="loading-subtext">ID: {id}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2 className="error-title">Error</h2>
          <p>{error}</p>
          <p style={{fontSize: '12px', marginTop: '8px'}}>ID: {id}</p>
        </div>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!wp) {
    return (
      <div className="not-found-container">
        <div className="not-found-card">
          <h2 className="error-title">Data Tidak Ditemukan</h2>
          <p>Data wajib pajak dengan ID tersebut tidak ditemukan.</p>
          <p style={{fontSize: '12px', marginTop: '8px'}}>ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sticker-page">
      <div className="sticker-container">
        {/* Preview Info */}
        <div className="preview-info no-print">
          <h1 className="preview-title">Sticker Wajib Pajak</h1>
          <p className="preview-subtitle">Preview sticker untuk {wp.nama}</p>
        </div>

        {/* Sticker Card */}
        <div ref={componentRef} className="sticker-card">
          {/* Background Pattern */}
          <div className="background-pattern">
            <div className="pattern-circle-1"></div>
            <div className="pattern-circle-2"></div>
            <div className="pattern-circle-3"></div>
          </div>

          {/* Header */}
          <div className="sticker-header">
            <div className="header-content">
              <div className="header-left">
                <div className="header-logo">
                  <span className="header-logo-text">WP</span>
                </div>
                <div>
                  <h2 className="header-title">WAJIB PAJAK</h2>
                  <p className="header-subtitle">Republik Indonesia</p>
                </div>
              </div>
              <div className="header-flag">
                <span className="flag-emoji">🇮🇩</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="sticker-content">
            <div className="content-wrapper">
              <div className="name-section">
                <p className="field-label">Nama Wajib Pajak</p>
                <h3 className="name-value">{wp.nama}</h3>
              </div>
              
              <div className="details-grid">
                <div className="detail-item">
                  <p className="detail-label">NPWP</p>
                  <p className="detail-value">{wp.npwp}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">WhatsApp</p>
                  <p className="detail-value">{wp.nomor_wa}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticker-footer">
            <div className="footer-content">
              <div className="status-text">
                Status: <span className={`status-value ${wp.status === 'sudah' ? 'status-sudah' : 'status-belum'}`}>
                  {wp.status === 'sudah' ? '✅ Sudah Lapor' : '⏳ Belum Lapor'}
                </span>
              </div>
              <div className="id-text">
                ID: {wp._id.slice(-6)}
              </div>
            </div>
          </div>

          {/* Decorative Corner */}
          <div className="decorative-corner"></div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons no-print">
          <button onClick={handlePrint} className="btn-primary">
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Cetak Sticker</span>
          </button>
          
          <button onClick={() => window.history.back()} className="btn-secondary">
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali</span>
          </button>
        </div>

        {/* Info Text */}
        <div className="info-text no-print">
          <p>Sticker ini dapat dicetak langsung. Ukuran optimal untuk kertas sticker 85mm x 54mm.</p>
        </div>
      </div>
    </div>
  );
};

export default StickerPage;