import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const API_BASE = import.meta.env.VITE_API_BASE_URL;


const BaptisAnak = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaAyah: "",
    namaIbu: "",
    alamat: "",
    namaAnak: "",
    jenisKelamin: "",
    tempatLahir: "",
    tanggalLahir: "",
    hariPelayanan: "",
    tanggalPelayanan: "",
    waktuPelayanan: "",
    tempatPelayanan: "",
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
        kodeTipeSurat: "BAP_ANAK", 
        // Judul untuk ditampilkan di daftar riwayat
        judul_surat: `Permohonan Baptis Anak: ${formData.namaAnak || 'Anonim'}`,
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
        navigate("/surat/hasil/baptis-anak", { state: formData });
    }
  };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          {/* Header Card dengan tombol kembali */}
          <div
            className="card-header d-flex align-items-center justify-content-between text-white py-3 px-4"
            style={{ backgroundColor: "#004d97" }}
          >
            {/* Tombol Kembali */}
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/surat")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Kembali
            </button>

            {/* Judul di Tengah */}
            <h4 className="mb-0 flex-grow-1 text-center me-4">
              ✝️ Form Permohonan Baptis Anak
            </h4>

            {/* Spacer agar posisi tombol kiri & judul seimbang */}
            <div style={{ width: "75px" }}></div>
          </div>

          {/* Body Form */}
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <h5 className="text-primary mb-3 fw-bold">
                🧑‍🤝‍👩 Data Orang Tua
              </h5>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyah"
                    value={formData.namaAyah}
                    onChange={handleChange}
                    required
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
                    required
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
                  required
                />
              </div>

              <h5 className="text-primary mb-3 fw-bold">👶 Data Anak</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Anak</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAnak"
                    value={formData.namaAnak}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    name="jenisKelamin"
                    className="form-select"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih Jenis Kelamin --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <h5 className="text-primary mb-3 fw-bold">
                📅 Jadwal Pelayanan Baptis
              </h5>
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Hari</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.hariPelayanan}
                    name="hariPelayanan"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.tanggalPelayanan}
                    name="tanggalPelayanan"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Waktu</label>
                  <input
                    type="time"
                    className="form-control"
                    name="waktuPelayanan"
                    value={formData.waktuPelayanan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tempat</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatPelayanan"
                    value={formData.tempatPelayanan}                  
                    onChange={handleChange}
                  />
                </div>
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

export default BaptisAnak;
