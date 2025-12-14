import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";

const Pertunangan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Umum
    tanggal: "",
    bulan: "",
    tahun: "",
    tempatPertunangan: "",

    // Pihak Perempuan
    namaPerempuan: "",
    tempatLahirPerempuan: "",
    tanggalLahirPerempuan: "",
    alamatPerempuan: "",
    namaAyahPerempuan: "",
    namaIbuPerempuan: "",
    tempatBaptisPerempuan: "",
    tanggalBaptisPerempuan: "",
    tempatSidiPerempuan: "",
    tanggalSidiPerempuan: "",
    wargaGerejaPerempuan: "",
    alamatGerejaPerempuan: "",

    // Pihak Laki-laki
    namaLaki: "",
    tempatLahirLaki: "",
    tanggalLahirLaki: "",
    alamatLaki: "",
    namaAyahLaki: "",
    namaIbuLaki: "",
    tempatBaptisLaki: "",
    tanggalBaptisLaki: "",
    tempatSidiLaki: "",
    tanggalSidiLaki: "",
    wargaGerejaLaki: "",
    alamatGerejaLaki: "",

    // Saksi & Orang Tua
    orangTuaPerempuan: "",
    orangTuaLaki: "",
    saksi1: "",
    saksi2: "",
    yangMelayankan: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Persiapkan Payload untuk Backend
    const payloadToBackend = {
        // Kode Tipe Surat harus sesuai dengan primary key di tabel surat_tipe Anda
        kodeTipeSurat: "TUNANGAN", 
        // Judul untuk ditampilkan di daftar riwayat
        judul_surat: `Permohonan Pertunangan: ${formData.namaLaki || 'Anonim'} dan ${formData.namaWanita || 'Anonim'}`,
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
        navigate("/surat/hasil/tunangan", { state: formData });
    }
  };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          {/* Header */}
          <div
            className="card-header text-white py-3 d-flex justify-content-between align-items-center"
            style={{ backgroundColor: "#004d97" }}
          >
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/surat")}
            >
              ← Kembali
            </button>
            <h4 className="mb-0 text-center flex-grow-1">
              💍 Form Berita Acara Pertunangan
            </h4>
            <div style={{ width: "40px" }}></div>
          </div>

          {/* Body */}
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Informasi Umum */}
              <h5 className="fw-bold mb-3" style={{ color: "#004d97" }}>
                Informasi Umum
              </h5>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="number"
                    className="form-control"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Bulan</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bulan"
                    value={formData.bulan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tahun</label>
                  <input
                    type="number"
                    className="form-control"
                    name="tahun"
                    value={formData.tahun}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tempat Pertunangan</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatPertunangan"
                    value={formData.tempatPertunangan}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr />

              {/* Pihak Perempuan */}
              <h5 className="fw-bold" style={{ color: "#004d97" }}>
                Data Pihak Perempuan
              </h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaPerempuan"
                    value={formData.namaPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahirPerempuan"
                    value={formData.tempatLahirPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahirPerempuan"
                    value={formData.tanggalLahirPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">Alamat</label>
                  <textarea
                    className="form-control"
                    name="alamatPerempuan"
                    rows="2"
                    value={formData.alamatPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyahPerempuan"
                    value={formData.namaAyahPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Ibu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaIbuPerempuan"
                    value={formData.namaIbuPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Baptis</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatBaptisPerempuan"
                    value={formData.tempatBaptisPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tanggal Baptis</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalBaptisPerempuan"
                    value={formData.tanggalBaptisPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Sidi</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatSidiPerempuan"
                    value={formData.tempatSidiPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tanggal Sidi</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalSidiPerempuan"
                    value={formData.tanggalSidiPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Warga Gereja</label>
                  <input
                    type="text"
                    className="form-control"
                    name="wargaGerejaPerempuan"
                    value={formData.wargaGerejaPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Alamat Gereja</label>
                  <input
                    type="text"
                    className="form-control"
                    name="alamatGerejaPerempuan"
                    value={formData.alamatGerejaPerempuan}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr />

              {/* Pihak Laki-laki */}
              <h5 className="fw-bold" style={{ color: "#004d97" }}>
                Data Pihak Laki-laki
              </h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaLaki"
                    value={formData.namaLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahirLaki"
                    value={formData.tempatLahirLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahirLaki"
                    value={formData.tanggalLahirLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">Alamat</label>
                  <textarea
                    className="form-control"
                    name="alamatLaki"
                    rows="2"
                    value={formData.alamatLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyahLaki"
                    value={formData.namaAyahLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Ibu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaIbuLaki"
                    value={formData.namaIbuLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Baptis</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatBaptisLaki"
                    value={formData.tempatBaptisLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tanggal Baptis</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalBaptisLaki"
                    value={formData.tanggalBaptisLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Sidi</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatSidiLaki"
                    value={formData.tempatSidiLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tanggal Sidi</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalSidiLaki"
                    value={formData.tanggalSidiLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Warga Gereja</label>
                  <input
                    type="text"
                    className="form-control"
                    name="wargaGerejaLaki"
                    value={formData.wargaGerejaLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Alamat Gereja</label>
                  <input
                    type="text"
                    className="form-control"
                    name="alamatGerejaLaki"
                    value={formData.alamatGerejaLaki}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr />

              {/* Saksi dan Pelayan */}
              <h5 className="fw-bold" style={{ color: "#004d97" }}>
                Saksi dan Pelayanan
              </h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Orang Tua Pihak Perempuan</label>
                  <input
                    type="text"
                    className="form-control"
                    name="orangTuaPerempuan"
                    value={formData.orangTuaPerempuan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Orang Tua Pihak Laki-laki</label>
                  <input
                    type="text"
                    className="form-control"
                    name="orangTuaLaki"
                    value={formData.orangTuaLaki}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Saksi I</label>
                  <input
                    type="text"
                    className="form-control"
                    name="saksi1"
                    value={formData.saksi1}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Saksi II</label>
                  <input
                    type="text"
                    className="form-control"
                    name="saksi2"
                    value={formData.saksi2}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">Yang Melayankan Pertunangan</label>
                  <input
                    type="text"
                    className="form-control"
                    name="yangMelayankan"
                    value={formData.yangMelayankan}
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

export default Pertunangan;
