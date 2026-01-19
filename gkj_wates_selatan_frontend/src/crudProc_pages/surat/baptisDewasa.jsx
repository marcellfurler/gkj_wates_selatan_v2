import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const BaptisDewasa = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    namaAyah: "",
    namaIbu: "",
    namaPasangan: "",
    tempatNikah: "",
    tanggalNikah: "",
    hariPelayanan: "",
    tanggalPelayanan: "",
    waktuPelayanan: "",
    tempatPelayanan: "",
    pembimbing: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Persiapkan Payload untuk Backend
    const payloadToBackend = {
        // Kode Tipe Surat harus sesuai dengan primary key di tabel surat_tipe Anda
        kodeTipeSurat: "BAP_DEWASA", 
        // Judul untuk ditampilkan di daftar riwayat
        judul_surat: `Permohonan Baptis Dewasa: ${formData.nama || 'Anonim'}`,
        // data_input adalah dictionary/JSON yang akan disimpan
        data_input_json: formData 
    };

    let isSavedSuccessfully = false;

    // 2. Kirim Data ke Backend (Endpoint: POST /api/surat)
    try {
        console.log("📤 Mengirim data permohonan ke backend...");
        const response = await fetch(`${API_BASE}/api/surat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadToBackend)
        });

        const result = await response.json();
        
        if (response.ok) {
            alert(`Surat berhasil disimpan. ID Transaksi: ${result.kodeSurat}`);
            console.log("✅ Transaksi surat berhasil disimpan:", result);
            isSavedSuccessfully = true;
        } else {
            // Menangani error dari controller
            alert(`Gagal menyimpan surat: ${result.message || 'Terjadi kesalahan pada server.'}`);
            console.error("Gagal simpan surat:", result);
        }
    } catch (error) {
        alert("Terjadi error jaringan/server saat menyimpan surat. Pastikan server aktif.");
        console.error("Error jaringan:", error);
    }

    // 3. Navigasi ke Template Hasil jika penyimpanan berhasil
    if (isSavedSuccessfully) {
        navigate("/surat/hasil/baptis-dewasa", { state: formData });
    }
  };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          <div
            className="card-header d-flex align-items-center justify-content-between text-white px-4 py-3"
            style={{ backgroundColor: "#004d97" }}
          >
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/surat")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Kembali
            </button>

            <h4 className="mb-0 flex-grow-1 text-center me-4">
              ✝️ Form Permohonan Baptis Dewasa
            </h4>
            <div style={{ width: "75px" }}></div>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {/* === Data Diri === */}
              <h5 className="text-primary mb-3 fw-bold">🧍 Data Diri</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Alamat</label>
                <input
                  type="text"
                  className="form-control"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                />
              </div>

              {/* === Orang Tua === */}
              <h5 className="text-primary mb-3 fw-bold">👨‍👩‍👧 Data Orang Tua</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyah"
                    value={formData.namaAyah}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Nama Ibu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaIbu"
                    value={formData.namaIbu}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* === Pasangan (Opsional) === */}
              <h5 className="text-primary mb-3 fw-bold">💍 Data Pasangan (Jika Sudah Menikah)</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Suami/Istri</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaPasangan"
                    value={formData.namaPasangan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tempat Nikah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatNikah"
                    value={formData.tempatNikah}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tanggal Nikah</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalNikah"
                    value={formData.tanggalNikah}
                    onChange={handleChange}
                  />
                </div>
              </div>


              {/* === Jadwal === */}
              <h5 className="text-primary mb-3 fw-bold">📅 Jadwal Pelayanan</h5>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Hari</label>
                  <input
                    type="text"
                    className="form-control"
                    name="hariPelayanan"
                    value={formData.hariPelayanan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalPelayanan"
                    value={formData.tanggalPelayanan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Waktu / Pukul</label>
                  <input
                    type="time"
                    className="form-control"
                    name="waktuPelayanan"
                    value={formData.waktuPelayanan}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Tempat Pelayanan</label>
                <input
                  type="text"
                  className="form-control"
                  name="tempatPelayanan"
                  value={formData.tempatPelayanan}
                  onChange={handleChange}
                />
              </div>

              {/* === Pembimbing === */}
              <h5 className="text-primary mb-3 fw-bold">👨‍🏫 Pembimbing</h5>
              <div className="mb-3">
                <label className="form-label">Nama Pembimbing Katekisasi</label>
                <input
                  type="text"
                  className="form-control"
                  name="pembimbing"
                  value={formData.pembimbing}
                  onChange={handleChange}
                />
              </div>

              <div className="text-end mt-4">
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  style={{ backgroundColor: "#004d97" }}
                >
                  Kirim Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaptisDewasa;
