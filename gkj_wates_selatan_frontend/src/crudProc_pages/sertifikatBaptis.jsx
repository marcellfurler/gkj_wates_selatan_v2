import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../components/NavbarComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDownload } from "@fortawesome/free-solid-svg-icons";
import { printSertifikat } from "../components/printSertifikat";

const SertifikatBaptis = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [sertifikatUrl, setSertifikatUrl] = useState("");

  useEffect(() => {
    const kodeJemaat = state?.kodeJemaat; // ✅ gunakan versi kecil

    if (kodeJemaat) {
      console.log("📤 Mengirim request untuk kodeJemaat:", kodeJemaat);
      
      fetch(`http://localhost:5000/api/baptis/${kodeJemaat}`)
        .then((res) => {
          console.log("📥 Status response:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("📦 Data diterima:", data);
          
          if (data && data.sertifikatBaptis) {
            const fixedUrl = data.sertifikatBaptis.replace("Localhost", "localhost");
            console.log("✅ URL Sertifikat (fixed):", fixedUrl);
            setSertifikatUrl(fixedUrl);
            } else {
            console.log("❌ Sertifikat tidak ada di response");
            setSertifikatUrl(null);
          }
        })
        .catch((err) => {
          console.error("❌ Error fetch:", err);
        });
    } else {
      console.log("⚠️ State atau kodeJemaat tidak ada:", state);
    }
  }, [state]);

  return (
    <div style={{ backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <NavbarComponent />

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Kembali
          </button>

          <h4 className="fw-bold text-primary mb-0">Sertifikat Baptis Jemaat</h4>

          <button
            className="btn btn-success"
            onClick={() =>
              printSertifikat("sertifikat-baptis", `Sertifikat_Baptis_${state?.nama || "Jemaat"}.pdf`)
            }
            disabled={!sertifikatUrl}
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" /> Download PDF
          </button>
        </div>

        <div
          id="sertifikat-baptis"
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
                alt="Sertifikat Baptis"
                style={{
                    width: "600px",          // 🔹 batasi ukuran fix (sama seperti sertifikat nikah/sidi)
                    height: "auto",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    maxWidth: "100%",        // tetap responsif kalau layar kecil
                }}
                onLoad={() => console.log("✅ Gambar Baptis berhasil dimuat!")}
                onError={() => console.error("❌ Gagal load gambar Baptis:", sertifikatUrl)}
                />

              <p className="mt-3 text-muted">
                Klik tombol di atas untuk mengunduh sertifikat ini sebagai PDF.
              </p>
            </>
          ) : (
            <p className="text-danger">
              ❌ Sertifikat baptis tidak ditemukan untuk jemaat ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SertifikatBaptis;