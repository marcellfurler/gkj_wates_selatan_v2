import React from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "./components/NavbarComponent";
import logoGKJ from "./assets/logoGKJ.png";
import backgroundimg2 from "./assets/gkjwatesselatan2.png";
import fotoProfil from "./assets/jimm.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const HalamanDeveloper = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavbarComponent />

      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${backgroundimg2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "20px",
        }}
      >
        <div
          className="card shadow-lg p-4"
          style={{
            maxWidth: "500px",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "15px",
          }}
        >
          <div className="text-center mb-2">
            <img
                src={fotoProfil}
                alt="Foto Developer"
                className="shadow mb-3"
                style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                }}
            />
            <h3 className="fw-bold">Developer Aplikasi</h3>
            </div>


          <div>
            <div className="mb-1">
              <label className="fw-bold">Nama</label>
              <input
                type="text"
                className="form-control"
                value="Marcell J. Manuhutu (Marcell/ Jimm)"
                disabled
              />
            </div>

            
            <div className="mb-1">
              <label className="fw-bold">Asal Institusi</label>
              <input
                type="text"
                className="form-control"
                value="Universitas Kristen Duta Wacana"
                disabled
              />
            </div>



            <div className="mb-1">
              <label className="fw-bold">Bidang</label>
              <input
                type="text"
                className="form-control"
                value="UI/UX, Web Development, Penyanyi, Penulis Lagu"
                disabled
              />
            </div>

            <div className="mb-1">
              <label className="fw-bold">Tentang Developer</label>
              <textarea
                className="form-control"
                style={{ resize: "none" }}
                rows="5"
                value="Saya adalah seorang mahasiswa informatika yang fokus pada UI/UX, game development, dan pengembangan web. Aplikasi ini dibuat untuk membantu pengelolaan data jemaat di GKJ Wates Selatan agar lebih modern dan mudah digunakan."
                disabled
              />
            </div>

            <div className="mb-1">
              <label className="fw-bold">Sumber daya pendukung</label>
              <textarea
                className="form-control"
                style={{ resize: "none" }}
                rows="3"
                value="JavaScript, React, Bootsrap, Laragon, PHPmyAdmin, ASUS A516JAO 2022, MySQL, css, HTML, GIT-Hub, Figma, YouTube, Chat GPT, Gemini, Google Workspace, FlatIcon"
                disabled
              />
            </div>

            <div className="mb-1">
              <label className="fw-bold">Big Thanks To</label>
              <textarea
                className="form-control"
                style={{ resize: "none" }}
                rows="5"
                value="Tuhan Yesus sang Guru Agung, Orang tua saya,Universitas Kristen Duta Wacana,
                Pendeta dan Warga Jemaat GKJ Wates Selatan, FTI UKDW, Pusat Pelatiihan Bahasa UKDW, Pak Gani, Carol, Thanel, Sia, teman-teman lain yang mendukung perkembangan proyek ini"
                disabled
              />
            </div>

            {/* TOMBOL BACK */}
            <button
              className="btn btn-secondary w-100 mt-2"
              onClick={() => navigate("/data")}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Kembali
            </button>

            <div className="text-center mt-4">
              <p className="text-muted small">
                © {new Date().getFullYear()} – Dibuat oleh Jimm - Universitas Kristen Duta Wacana - Fakultas Teknologi Informasi - Program Studi Informatika
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HalamanDeveloper;
