import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavbarComponent } from "./components/NavbarComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faArrowRight, faImage } from "@fortawesome/free-solid-svg-icons";
import Footer from "./components/footer";

const API_BASE = import.meta.env.VITE_API_BASE_URL;


/* === Komponen Daftar Surat Jemaat === */
const DaftarSuratJemaat = () => {
  const [daftarSurat, setDaftarSurat] = useState([]);
  const navigate = useNavigate();

  const tipeToPrintPath = {
    BAP_ANAK: "baptis-anak",
    BAP_DEWASA: "baptis-dewasa",
    TOBAT: "pertobatan",
    CALON_MAJELIS: "calon-majelis",
    BESUK_PERJAMUAN: "besuk-perjamuan",
    KATEKISASI: "katekisasi",
    KELAHIRAN: "pemberitahuan-kelahiran",
    NIKAH: "nikah",
    PENG_PERCAYA: "pengakuan-percaya",
    TUNANGAN: "tunangan"
  };
  // -----------------------------
  // Format tanggal
  // -----------------------------
  const formatTanggalLengkap = (tanggal) => {
    if (!tanggal) return "-";

    const date = new Date(tanggal);

    // Nama hari manual
    const hari = date.toLocaleDateString("id-ID", { weekday: "long" });

    // Tanggal lengkap
    const tanggalLokal = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Waktu lengkap
    const waktu = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `${hari}, ${tanggalLokal} (Pukul ${waktu})`;
  };


  useEffect(() => {
    fetch(`${API_BASE}/api/surat`)
      .then((res) => res.json())
      .then((data) => {
        setDaftarSurat(data);
      })
      .catch((err) => console.error("Gagal load surat:", err));
  }, []);

  const handleDelete = async (kodeDataSurat) => {
    if (!window.confirm("Yakin ingin menghapus surat ini?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/surat/${kodeDataSurat}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      setDaftarSurat((prev) => prev.filter((s) => s.kodeDataSurat !== kodeDataSurat));
      alert("Surat berhasil dihapus!");

    } catch (err) {
      console.error(err);
      alert("Gagal menghapus surat");
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3" style={{ color: "#004d97" }}>
        Daftar Surat Jemaat
      </h5>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>No</th>
              <th>Judul Surat</th>
              <th>Tanggal Input</th>
              <th style={{ width: "250px" }}>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {daftarSurat.map((s, i) => (
              <tr key={s.kodeDataSurat}>
                <td>{i + 1}</td>
                <td>{s.judul_surat}</td>
                <td>{formatTanggalLengkap(s.tanggal_input)}</td>

                <td className="d-flex gap-2">
                  {/* <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => {
                      localStorage.setItem("idSuratEdit", s.kodeDataSurat);
                      navigate(`${tipeToPrintPath[s.kodeTipeSurat]}`);
                    }}
                  >
                    Edit
                  </button> */}

                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => {
                      localStorage.setItem("idSuratPrint", s.kodeDataSurat);
                      navigate(`/surat/hasil/${tipeToPrintPath[s.kodeTipeSurat]}`);
                    }}
                  >
                    Print
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(s.kodeDataSurat)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {daftarSurat.length === 0 && (
        <p className="text-muted mt-3">Belum ada surat yang dibuat.</p>
      )}
    </div>
  );
};

/* === Halaman Utama === */
const HalamanSurat = () => {
  const navigate = useNavigate();

  /* === SIMPAN TAB AKTIF TANPA bootstrap.js === */
  useEffect(() => {
    const buttons = document.querySelectorAll("[data-bs-toggle='tab']");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-bs-target");
        localStorage.setItem("halamanSuratActiveTab", target);
      });
    });
  }, []);

  /* === RESTORE TAB AKTIF === */
  useEffect(() => {
    const saved = localStorage.getItem("halamanSuratActiveTab");
    if (!saved) return;

    const btn = document.querySelector(`[data-bs-target='${saved}']`);
    const content = document.querySelector(saved);

    if (!btn || !content) return;

    // hilangkan active di semua tab
    document.querySelectorAll(".nav-link").forEach((el) => el.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach((el) => {
      el.classList.remove("show", "active");
    });

    // Aktifkan tab yg disimpan
    btn.classList.add("active");
    content.classList.add("show", "active");
  }, []);

  const kelompokSurat = [
    {
      kategori: "Pelayanan Sakramen dan Pertobatan",
      surat: [
        { id: 1, nama: "Surat Permohonan Baptis Anak", path: "/surat/baptis-anak" },
        { id: 2, nama: "Surat Permohonan Baptis Dewasa", path: "/surat/baptis-dewasa" },
        { id: 3, nama: "Surat Permohonan Pertobatan", path: "/surat/pertobatan" },
        { id: 4, nama: "Surat Pengakuan Percaya (Sidi)", path: "/surat/pengakuan-percaya" },
        { id: 11, nama: "Laporan Besuk Perjamuan Kudus", path: "/surat/besuk-perjamuan" },
      ],
    },
    {
      kategori: "Peristiwa Kehidupan Jemaat",
      surat: [
        { id: 5, nama: "Surat Pemberitahuan Kelahiran", path: "/surat/pemberitahuan-kelahiran" },
        { id: 6, nama: "Surat Berita Acara Pertunangan", path: "/surat/tunangan" },
        { id: 7, nama: "Surat Permohonan Pemberkatan Nikah", path: "/surat/nikah" },
      ],
    },
    {
      kategori: "Pembinaan dan Pendidikan Iman",
      surat: [
        { id: 8, nama: "Surat Permohonan Bimbingan Katekisasi", path: "/surat/katekisasi" },
      ],
    },
    {
      kategori: "Kepengurusan dan Administrasi Gereja",
      surat: [
        { id: 9, nama: "Surat Kesanggupan Pencalonan Majelis", path: "/surat/calon-majelis" },
      ],
    },
  ];

  return (
    <div>
      <NavbarComponent />

      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          <div
            className="card-header text-white d-flex align-items-center justify-content-between mb-3 py-3"
            style={{ backgroundColor: "#004d97" }}
          >
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/data")}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Kembali
            </button>

            <h4 className="mb-0 text-center flex-grow-1" style={{ color: "white" }}>
              📄 Pembuatan Template Surat
            </h4>

            <div style={{ width: "80px" }}></div>
          </div>

          <div className="card-body">
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="nav-home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-home"
                  role="tab"
                  style={{ color: "#004d97" }}
                >
                  Template Surat
                </button>

                <button
                  className="nav-link"
                  id="nav-favorit-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-favorit"
                  role="tab"
                  style={{ color: "#004d97" }}
                >
                  Daftar Surat Jemaat
                </button>


              </div>
            </nav>

            <div className="tab-content" id="nav-tabContent">

              {/* TAB 1 */}
              <div
                className="tab-pane fade show active mt-4"
                id="nav-home"
                role="tabpanel"
              >
                {kelompokSurat.map((kelompok, index) => (
                  <div key={index} className="mb-4">
                    <h5 className="fw-bold mb-3" style={{ color: "#004d97" }}>
                      {kelompok.kategori}
                    </h5>

                    <div className="table-responsive">
                      <table className="table table-bordered table-striped align-middle">
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: "50px" }}>No</th>
                            <th>Nama Surat</th>
                            <th style={{ width: "150px" }}>Aksi</th>
                          </tr>
                        </thead>

                        <tbody>
                          {kelompok.surat.map((surat, i) => (
                            <tr key={surat.id}>
                              <td>{i + 1}</td>
                              <td>{surat.nama}</td>

                              <td>
                                <Link
                                  to={surat.path}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  Buat
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>

                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* TAB 2 */}
              <div
                className="tab-pane fade mt-4"
                id="nav-favorit"
                role="tabpanel"
              >
                <DaftarSuratJemaat />
              </div>


            </div>
          </div>

        </div>
      </div>
      <Footer/>
    </div>
    
  );
};

export default HalamanSurat;
