import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../components/NavbarComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDownload } from "@fortawesome/free-solid-svg-icons";
import { printSertifikat } from "../components/printSertifikat";

const SertifikatSidi = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [sertifikatUrl, setSertifikatUrl] = useState("");

  useEffect(() => {
    const kodeJemaat = state?.kodeJemaat; // ✅ gunakan huruf kecil agar konsisten
    if (kodeJemaat) {
      console.log("📤 Mengirim request untuk NIK (Sidi):", kodeJemaat);

      fetch(`http://localhost:5000/api/sidi/${kodeJemaat}`)
        .then((res) => {
          console.log("📥 Status response:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("📦 Data diterima (Sidi):", data);
          if (data && data.sertifikatSidi) {
            console.log("✅ URL Sertifikat Sidi:", data.sertifikatSidi);
            setSertifikatUrl(data.sertifikatSidi);
          } else {
            console.log("❌ Sertifikat Sidi tidak ada di response");
            setSertifikatUrl(null);
          }
        })
        .catch((err) => {
          console.error("❌ Error fetch Sidi:", err);
        });
    } else {
      console.log("⚠️ State atau NIK tidak ada:", state);
    }
  }, [state]);

  return (
    <div style={{ backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <NavbarComponent />

      <div className="container py-5">
        {/* 🔹 Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Kembali
          </button>

          <h4 className="fw-bold text-primary mb-0">Sertifikat Sidi Jemaat</h4>

          <button
            className="btn btn-success"
            onClick={() =>
              printSertifikat(
                "sertifikat-sidi",
                `Sertifikat_Sidi_${state?.nama || "Jemaat"}.pdf`
              )
            }
            disabled={!sertifikatUrl}
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" /> Download PDF
          </button>
        </div>

        {/* 🔹 Konten Sertifikat */}
        <div
          id="sertifikat-sidi"
          className="bg-white shadow p-4 rounded text-center"
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            border: "1px solid #ccc",
          }}
        >
          {sertifikatUrl ? (
            <>
              <img
                src={sertifikatUrl}
                alt="Sertifikat Sidi"
                style={{
                  maxWidth: "100%",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
                onLoad={() => console.log("✅ Gambar Sidi berhasil dimuat!")}
                onError={(e) => {
                  console.error("❌ Gagal load gambar Sidi:", sertifikatUrl);
                  console.error("❌ Error event:", e);
                }}
              />
              <p className="mt-3 text-muted">
                Klik tombol di atas untuk mengunduh sertifikat ini sebagai PDF.
              </p>
            </>
          ) : (
            <p className="text-danger">
              ❌ Sertifikat sidi tidak ditemukan untuk jemaat ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SertifikatSidi;
