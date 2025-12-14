import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";

const Pernikahan = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Data Pribadi Pihak Laki-Laki
    namaPria: "",
    tempatLahirPria: "",
    tanggalLahirPria: "",
    alamatPria: "",
    pekerjaanPria: "",
    namaAyahPria: "",
    namaIbuPria: "",
    tempatBaptisPria: "",
    tempatSidiPria: "",
    wargaGerejaPria: "",

    // Data Pribadi Pihak Perempuan
    namaWanita: "",
    tempatLahirWanita: "",
    tanggalLahirWanita: "",
    alamatWanita: "",
    pekerjaanWanita: "",
    namaAyahWanita: "",
    namaIbuWanita: "",
    tempatBaptisWanita: "",
    tempatSidiWanita: "",
    wargaGerejaWanita: "",

    // Jadwal Pelayanan
    hariPelayanan: "",
    tanggalPelayanan: "",
    waktuPelayanan: "",
    tempatPelayanan: "",

    // Pembimbing / Katekisasi
    pembimbing: "",
    durasiKatekisasi: "",
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
        kodeTipeSurat: "NIKAH", 
        // Judul untuk ditampilkan di daftar riwayat
        judul_surat: `Permohonan Pernikahan: ${formData.namaPria || 'Anonim'} dan ${formData.namaWanita || 'Anonim'}`,
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
        navigate("/surat/hasil/nikah", { state: formData });
    }
  };

  return (
    <div>
      <NavbarComponent />

      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">

          {/* === HEADER FORM === */}
          <div
            className="card-header position-relative text-white py-3 px-4 text-center"
            style={{ backgroundColor: "#004d97" }}
          >
            {/* Tombol Kembali di kiri */}
            <button
              className="btn btn-light btn-sm position-absolute start-0 ms-3"
              onClick={() => navigate(-1)}
              style={{ fontWeight: "bold" }}
            >
              ← Kembali
            </button>

            {/* Judul di tengah */}
            <h4 className="mb-0">
              💒 Form Permohonan Peneguhan dan Pemberkatan Pernikahan
            </h4>
          </div>

          {/* === BODY FORM === */}
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              
              {/* === DATA PIHAK LAKI-LAKI === */}
              <h5 className="fw-bold mt-2 mb-3" style={{ color: "#004d97" }}>
                Data Pihak Laki-Laki
              </h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaPria"
                    value={formData.namaPria}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahirPria"
                    value={formData.tempatLahirPria}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahirPria"
                    value={formData.tanggalLahirPria}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Alamat</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="alamatPria"
                    value={formData.alamatPria}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Pekerjaan</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pekerjaanPria"
                    value={formData.pekerjaanPria}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyahPria"
                    value={formData.namaAyahPria}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Nama Ibu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaIbuPria"
                    value={formData.namaIbuPria}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Baptis</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatBaptisPria"
                    value={formData.tempatBaptisPria}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Sidi</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatSidiPria"
                    value={formData.tempatSidiPria}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Warga Gereja</label>
                  <input
                    type="text"
                    className="form-control"
                    name="wargaGerejaPria"
                    value={formData.wargaGerejaPria}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr className="my-4" />

              {/* === DATA PIHAK PEREMPUAN === */}
              <h5 className="fw-bold mt-2 mb-3" style={{ color: "#004d97" }}>
                Data Pihak Perempuan
              </h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaWanita"
                    value={formData.namaWanita}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahirWanita"
                    value={formData.tempatLahirWanita}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahirWanita"
                    value={formData.tanggalLahirWanita}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Alamat</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="alamatWanita"
                    value={formData.alamatWanita}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Pekerjaan</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pekerjaanWanita"
                    value={formData.pekerjaanWanita}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyahWanita"
                    value={formData.namaAyahWanita}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Nama Ibu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaIbuWanita"
                    value={formData.namaIbuWanita}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Baptis</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatBaptisWanita"
                    value={formData.tempatBaptisWanita}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Sidi</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatSidiWanita"
                    value={formData.tempatSidiWanita}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Warga Gereja</label>
                  <input
                    type="text"
                    className="form-control"
                    name="wargaGerejaWanita"
                    value={formData.wargaGerejaWanita}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr className="my-4" />

              {/* === JADWAL === */}
              <h5 className="fw-bold" style={{ color: "#004d97" }}>
                Jadwal Pelayanan
              </h5>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Hari Pelayanan</label>
                  <input
                    type="text"
                    className="form-control"
                    name="hariPelayanan"
                    value={formData.hariPelayanan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Tanggal Pelayanan</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalPelayanan"
                    value={formData.tanggalPelayanan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Waktu / Pukul</label>
                  <input
                    type="time"
                    className="form-control"
                    name="waktuPelayanan"
                    value={formData.waktuPelayanan}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Tempat Pelayanan</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatPelayanan"
                    value={formData.tempatPelayanan}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr className="my-4" />

              {/* === PEMBIMBING === */}
              <h5 className="fw-bold" style={{ color: "#004d97" }}>
                Informasi Pembimbing / Katekisasi
              </h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Pembimbing</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pembimbing"
                    value={formData.pembimbing}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Durasi Katekisasi</label>
                  <input
                    type="text"
                    className="form-control"
                    name="durasiKatekisasi"
                    placeholder="contoh: 3 bulan"
                    value={formData.durasiKatekisasi}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* === Tombol Aksi === */}
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

export default Pernikahan;
