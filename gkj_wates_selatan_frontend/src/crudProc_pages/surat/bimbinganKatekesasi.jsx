import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";

const BimbinganKatekesasi = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    namaAyah: "",
    namaIbu: "",
    tanggalBaptis: "",
    tempatBaptis: "",
    hariBimbingan: "",
    waktuBimbingan: "",
    tempatBimbingan: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Persiapkan Payload untuk Backend
    const payloadToBackend = {
        // Kode Tipe Surat harus sesuai dengan primary key di tabel surat_tipe Anda
        kodeTipeSurat: "KATEKISASI", 
        // Judul untuk ditampilkan di daftar riwayat
        judul_surat: `Permohonan Katekisasi: ${formData.nama || 'Anonim'}`,
        // data_input adalah dictionary/JSON yang akan disimpan
        data_input_json: formData 
    };

    let isSavedSuccessfully = false;

    // 2. Kirim Data ke Backend (Endpoint: POST /api/surat)
    try {
        console.log("📤 Mengirim data permohonan ke backend...");
        const response = await fetch('http://localhost:5000/api/surat', {
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
        navigate("/surat/hasil/katekisasi", { state: formData });
    }
  };

  return (
    <div>
      <NavbarComponent />

      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          {/* === HEADER FORM === */}
          <div
            
            style={{ backgroundColor: "#004d97" }}
          >
            <div className="card-header d-flex align-items-center justify-content-between text-white px-4 py-3">
              <button
                className="btn btn-light btn-sm fw-bold"
                onClick={() => navigate(-1)}
              >
                ←Kembali
              </button>
              <h4 className="text-center flex-grow-1 m-0 w-100">
                📖 Form Permohonan Bimbingan Katekisasi
              </h4>
            </div>
          </div>

          {/* === BODY FORM === */}
          <div className="card-body px-4 py-4">
            <form onSubmit={handleSubmit}>
              <h5 className="fw-bold mb-3 text-primary">🧍 Data Jemaat</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nama</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Tempat Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    // required
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label fw-bold">Alamat</label>
                  <input
                    type="text"
                    className="form-control"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    // required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyah"
                    value={formData.namaAyah}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nama Ibu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaIbu"
                    value={formData.namaIbu}
                    onChange={handleChange}
                    // required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Tanggal Baptis Anak</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalBaptis"
                    value={formData.tanggalBaptis}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Tempat Baptis Anak</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatBaptis"
                    value={formData.tempatBaptis}
                    onChange={handleChange}
                    // required
                  />
                </div>
              </div>

              <hr className="my-4" />

              <h5 className="fw-bold mb-3 text-success">📅 Jadwal Bimbingan</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Hari</label>
                  <input
                    type="text"
                    className="form-control"
                    name="hariBimbingan"
                    value={formData.hariBimbingan}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Waktu / Pukul</label>
                  <input
                    type="time"
                    className="form-control"
                    name="waktuBimbingan"
                    value={formData.waktuBimbingan}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Tempat</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatBimbingan"
                    value={formData.tempatBimbingan}
                    onChange={handleChange}
                    // required
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

export default BimbinganKatekesasi;
