import React, { useRef, useState, useEffect } from "react";
import api from "../config/api";

export default function FaceCheck({ open, onClose, onSuccess }) {
  const videoRef = useRef(null);
  const [capturing, setCapturing] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Gagal mengakses kamera");
    }
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const scale = 0.5;
    canvas.width = videoRef.current.videoWidth * scale;
    canvas.height = videoRef.current.videoHeight * scale;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  };

  const handleVerify = async () => {
    setCapturing(true);
    const imageData = captureImage();
    try {
      const res = await api.post("/api/face/verify", { image: imageData });
      if (res.data.success) {
        alert("✅ Wajah terverifikasi");
        onSuccess();   // panggil BuatLaporan kalau sukses
        onClose();     // tutup modal
      } else {
        alert("❌ Verifikasi wajah gagal");
      }
    } catch (err) {
      console.error("Error verifikasi wajah:", err);
      alert("Gagal verifikasi wajah");
    } finally {
      setCapturing(false);
    }
  };

  useEffect(() => {
    if (open) startCamera();
  }, [open]);

  if (!open) return null; // ❌ modal tidak ditampilkan kalau open=false

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.7)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 9999
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: 20, width: "90%", maxWidth: 400
      }}>
        <h3 style={{ marginBottom: 12 }}>Verifikasi Wajah</h3>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "100%", borderRadius: 8, marginBottom: 12 }}
        />
        <button
          onClick={handleVerify}
          disabled={capturing}
          style={{
            background: "#28a745", color: "#fff", padding: "10px 20px",
            border: "none", borderRadius: 6, cursor: "pointer"
          }}
        >
          {capturing ? "Memverifikasi..." : "Verifikasi Sekarang"}
        </button>
        <button
          onClick={onClose}
          style={{
            marginLeft: 10, background: "#ccc", padding: "10px 20px",
            border: "none", borderRadius: 6, cursor: "pointer"
          }}
        >
          Batal
        </button>
      </div>
    </div>
  );
}
