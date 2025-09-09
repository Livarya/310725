import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useReactToPrint } from "react-to-print";
import { Link } from "react-router-dom";
import "./QrisModal.css";

const QrisModal = ({ data }) => {
  const [open, setOpen] = useState(false);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
        size: 85mm 54mm;
        margin: 0;
      }
    `
  });

  // Validasi data
  if (!data || !data._id) {
    return <button className="qris-error">Error</button>;
  }

  const qrValue = `https://f650c252754c.ngrok-free.app/sticker/${data._id}`;

  return (
    <>
      {/* Tombol QRIS */}
      <button
        onClick={() => setOpen(true)}
        className="qris-button"
      >
        QRIS
      </button>

      {/* Modal - Fixed positioning to center */}
      {open && (
        <div className="qris-overlay" onClick={() => setOpen(false)}>
          <div className="qris-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="qris-header">
              <h3 className="qris-title">{data.nama}</h3>
              <p className="qris-debug">ID: {data._id.slice(-8)}</p>
            </div>

            <div className="qris-body">
              {/* QR Code */}
              <div className="qr-container">
                <div className="qr-wrapper">
                  <QRCodeSVG
                    value={qrValue}
                    size={100}
                    level="M"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <p className="qr-help">Scan untuk melihat sticker</p>
              </div>

              {/* Info */}
              <div className="qris-info">
                <div className="info-item">
                  <span className="info-label">NPWP:</span>
                  <span className="info-value">{data.npwp}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">WA:</span>
                  <span className="info-value">{data.nomor_wa}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className={`info-value ${data.status === 'sudah' ? 'status-sudah' : 'status-belum'}`}>
                    {data.status === 'sudah' ? '✓ Sudah Lapor' : '○ Belum Lapor'}
                  </span>
                </div>
              </div>

              {/* Hidden Print Content */}
              <div className="print-hidden">
                <div ref={componentRef} className="print-sticker">
                  <div className="print-header">
                    WAJIB PAJAK - REPUBLIK INDONESIA
                  </div>
                  <div className="print-content">
                    <div className="print-name">{data.nama}</div>
                    <div className="print-details">
                      <div>NPWP: {data.npwp}</div>
                      <div>WA: {data.nomor_wa}</div>
                    </div>
                  </div>
                  <div className="print-footer">
                    <span className={data.status === 'sudah' ? 'status-sudah' : 'status-belum'}>
                      {data.status === 'sudah' ? '✓ Sudah' : '○ Belum'}
                    </span>
                    <span>ID: {data._id.slice(-4)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="qris-actions">
                <button
                  onClick={handlePrint}
                  className="action-btn btn-print"
                >
                  Cetak
                </button>

                <Link
                  to={`/sticker/${data._id}`}
                  className="action-btn btn-view"
                >
                  Lihat
                </Link>

                <button
                  onClick={() => setOpen(false)}
                  className="action-btn btn-close"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QrisModal;