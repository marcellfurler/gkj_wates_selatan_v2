import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";

const PengakuanPercaya = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    namaAyah: "",
    namaIbu: "",
    tanggalBaptis: "",
    tempatBaptis: "",
    hariPelayanan: "",
    tanggalPelayanan: "",
    waktuPelayanan: "",
    tempatPelayanan: "",
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
        kodeTipeSurat: "PENG_PERCAYA", 
        // Judul untuk ditampilkan di daftar riwayat
        judul_surat: `Permohonan Pengakuan Percaya: ${formData.nama || 'Anonim'}`,
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
        navigate("/surat/hasil/pengakuan-percaya", { state: formData });
    }
  };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          {/* === HEADER CARD === */}
          <div
            className="card-header d-flex justify-content-between align-items-center text-white py-3 px-4"
            style={{ backgroundColor: "#004d97" }}
          >
            {/* Tombol kembali di kiri */}
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate(-1)}
              style={{ fontWeight: "bold" }}
            >
              ← Kembali
            </button>

            {/* Judul di tengah */}
            <h4 className="mb-0 text-center flex-grow-1">
              🕊️ Form Permohonan Pengakuan Percaya (SIDI)
            </h4>

            {/* Spacer di kanan supaya tombol dan judul seimbang */}
            <div style={{ width: "90px" }}></div>
          </div>

          {/* === BODY FORM === */}
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Nama */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                  />
                </div>

                {/* Tempat dan Tanggal Lahir */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                  />
                </div>

                {/* Alamat */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Alamat</label>
                  <textarea
                    className="form-control"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>

                {/* Nama Ayah & Ibu */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyah"
                    value={formData.namaAyah}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Ibu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaIbu"
                    value={formData.namaIbu}
                    onChange={handleChange}
                  />
                </div>

                {/* Baptis */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tanggal Baptis Anak</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalBaptis"
                    value={formData.tanggalBaptis}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Baptis Anak</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatBaptis"
                    value={formData.tempatBaptis}
                    onChange={handleChange}
                  />
                </div>

                <hr className="my-4" />

                {/* Jadwal Pelayanan */}
                <h5 className="fw-bold" style={{ color: "#004d97" }}>
                  Jadwal Pelayanan
                </h5>
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

                <hr className="my-4" />

                {/* Pembimbing */}
                <h5 className="fw-bold" style={{ color: "#004d97" }}>
                  Informasi Katekisasi
                </h5>
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

              {/* Tombol submit */}
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

export default PengakuanPercaya;
