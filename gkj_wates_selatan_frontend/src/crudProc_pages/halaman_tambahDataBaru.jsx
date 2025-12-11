import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faArrowRight, faImage } from "@fortawesome/free-solid-svg-icons";
import { NavbarComponent } from "../components/NavbarComponent";
import Footer from "../components/footer";

const HalamanTambahDataBaru = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [previewFoto, setPreviewFoto] = useState(null);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    kodeJemaat: "",
    alamat: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    golonganDarah: "",
    nomorTelepon: "",
    pepanthan: "",
    namaPelayanan: "",
    statusSidi: "",
    statusBaptis: "",
    statusNikah: "",
    statusMeninggal: "",
    foto: "",
    namaPekerjaan:"",
    jabatanKerja:"",
    // Nikah
    tanggalNikah: "",
    tempatNikah: "",
    namaPasangan: "",
    gerejaAsal: "",
    // Sidi
    tanggalSidi: "",
    tempatSidi: "",
    // Baptis
    tanggalBaptis: "",
    tempatBaptis: "",
    // Meninggal
    tanggalMeninggal: "",
    tempatMeninggal: "",
    // Pendeta
    dataPendeta: {},
    dataPelayananList: [],
  });

  // Handle input perubahan
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewFoto(URL.createObjectURL(file));
      setFormData({ ...formData, foto: file });
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(3); // semua langsung ke step 3
  };


  const handleNextAfterPelayanan = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(1); // kembalikan langsung ke step 1
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiEndpoint =
      formData.namaPelayanan === "Pendeta"
        ? "http://localhost:5000/api/pendeta"
        : "http://localhost:5000/api/jemaat";

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        // file
        if (formData[key] instanceof File) {
          form.append(key, formData[key]);
        }
        // array khusus pendeta → harus dijadikan string
        else if (key === "dataPelayananList") {
          form.append(key, JSON.stringify(formData.dataPelayananList || []));
        }
        // object pendeta
        else if (key === "dataPendeta") {
          form.append(key, JSON.stringify(formData.dataPendeta || {}));
        }
        // value normal
        else {
          form.append(key, formData[key] || "");
        }
      });

      const res = await fetch(apiEndpoint, { method: "POST", body: form });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Data berhasil ditambahkan!");
        navigate("/data");
      } else {
        alert(data.message || "Gagal menambahkan data.");
        console.error(data);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  // ===== STEP 2 - RIWAYAT PELAYANAN PENDETA =====
  const [pelayananList, setPelayananList] = useState([
    { namaGereja: "", tahunMulai: "", tahunSelesai: "" },
  ]);

  const handlePelayananChange = (index, field, value) => {
    const updated = [...pelayananList];
    updated[index][field] = value;
    setPelayananList(updated);
    setFormData({ ...formData, dataPelayananList: updated });
  };

  const addPelayanan = () =>
    setPelayananList([
      ...pelayananList,
      { namaGereja: "", tahunMulai: "", tahunSelesai: "" },
    ]);

  const removePelayanan = (index) => {
    const updated = pelayananList.filter((_, i) => i !== index);
    setPelayananList(updated);
    setFormData({ ...formData, dataPelayananList: updated });
  };

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  const showNikah = formData.statusNikah === "Nikah";
  const showSidi = formData.statusSidi === "Sidi";
  const showBaptis = formData.statusBaptis === "Baptis";
  const showMeninggal = formData.statusMeninggal === "Meninggal";

  return (
    <>
      <NavbarComponent />
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          {step === 1 ? (
            <Link to="/data" className="btn btn-secondary">
              <FontAwesomeIcon icon={faArrowLeft} /> Kembali
            </Link>
          ) : (
            <button onClick={handleBack} className="btn btn-secondary">
              <FontAwesomeIcon icon={faArrowLeft} /> Kembali
            </button>
          )}
          <h3 className="text-center flex-grow-1">
            {step === 1
              ? "Tambah Data Baru"
              : step === 2
              ? "Form Data Pelayanan"
              : "Form Data Tambahan"}
          </h3>
          <div style={{ width: "80px" }}></div>
        </div>

        <div className="progress mb-4" style={{ height: "20px" }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
            style={{ width: `${progress}%` }}
          >
            Step {step} / 3
          </div>
        </div>

        <div className="card shadow p-4">

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <form onSubmit={handleNext}>
              <h4 className="mb-3">Informasi Diri</h4>

              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    name="namaLengkap"
                    className="form-control mb-3"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                  />

                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    name="tempatLahir"
                    className="form-control mb-3"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                  />

                  <label className="form-label">Alamat</label>
                  <input
                    type="text"
                    name="alamat"
                    className="form-control mb-3"
                    value={formData.alamat}
                    onChange={handleChange}
                  />

                  <label className="form-label">Nomor Telepon</label>
                  <input
                    type="text"
                    name="nomorTelepon"
                    className="form-control mb-3"
                    value={formData.nomorTelepon}
                    onChange={handleChange}
                  />

                  <label className="form-label">Agama</label>
                  <select
                    name="agama"
                    className="form-select mb-3"
                    value={formData.agama}
                    onChange={handleChange}
                  >
                    <option value="">Pilih...</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Budha">Budha</option>
                    <option value="Islam">Islam</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>

                {/* Kolom kanan */}
                <div className="col-md-6">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    className="form-control mb-3"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                  />

                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    name="jenisKelamin"
                    className="form-select mb-3"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Laki-Laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>

                  <label className="form-label">Golongan Darah</label>
                  <select
                    name="golonganDarah"
                    className="form-select mb-3"
                    value={formData.golonganDarah}
                    onChange={handleChange}
                  >
                    <option value="">Pilih...</option>
                    <option value="A">A</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                    <option value="B">B</option>
                    <option value="Belum Diketahui">Belum Diketahui</option>
                  </select>

                  <label className="form-label">
                    <FontAwesomeIcon icon={faImage} className="me-2" />
                    Upload Foto Jemaat
                  </label>
                  <input
                    type="file"
                    name="foto"
                    accept="image/*"
                    className="form-control mb-3"
                    onChange={handleFotoUpload}
                  />
                  {previewFoto && (
                    <img
                      src={previewFoto}
                      alt="Preview"
                      className="img-thumbnail mt-2"
                      style={{ width: "120px", height: "120px" }}
                    />
                  )}
                </div>
              </div>

              <hr />
              {/* Pekerjaan */}
              <h4 className="mb-3">Pekerjaan</h4>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Nama Pekerjaan</label>
                  <input type="text" name="namaPekerjaan" className="form-control mb-3" value={formData.namaPekerjaan} onChange={handleChange} />

                  <label className="form-label">Jabatan</label>
                  <input type="text" name="jabatanKerja" className="form-control mb-3" value={formData.jabatanKerja} onChange={handleChange} />
                </div>
              </div>

              <hr />

              {/* Informasi Gerejawi */}
              <h4 className="mb-3">Informasi Gerejawi</h4>

              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Pepanthan</label>
                  <select
                    name="pepanthan"
                    className="form-select mb-3"
                    value={formData.pepanthan}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Induk Depok Kelompok 1">Induk Depok Kelompok 1</option>
                    <option value="Induk Depok Kelompok 2">Induk Depok Kelompok 2</option>
                    <option value="Induk Depok Kelompok 3">Induk Depok Kelompok 3</option>
                    <option value="Triharjo">Triharjo</option>
                    <option value="Galur">Galur</option>
                    <option value="Wonogiri">Wonogiri</option>
                  </select>

                  <label className="form-label">Status Nikah</label>
                  <select
                    name="statusNikah"
                    className="form-select mb-3"
                    value={formData.statusNikah}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Nikah">Nikah</option>
                    <option value="Belum Nikah">Belum Nikah</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Meninggal">Cerai Meninggal</option>
                  </select>

                  <label className="form-label">Status Baptis</label>
                  <select
                    name="statusBaptis"
                    className="form-select mb-3"
                    value={formData.statusBaptis}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Baptis">Baptis</option>
                    <option value="Belum Baptis">Belum Baptis</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Status Pelayanan</label>
                  <select
                    name="namaPelayanan"
                    className="form-select mb-3"
                    value={formData.namaPelayanan}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Jemaat">Jemaat</option>
                    {/* <option value="Pendeta">Pendeta</option> */}
                    <option value="Majelis">Majelis</option>
                    <option value="Koordinator Pelayanan">Koordinator Pelayanan</option>
                    <option value="Meninggal">Meninggal</option>
                  </select>

                  <label className="form-label">Status Sidi</label>
                  <select
                    name="statusSidi"
                    className="form-select mb-3"
                    value={formData.statusSidi}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Sidi">Sidi</option>
                    <option value="Belum Sidi">Belum Sidi</option>
                  </select>
                </div>
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-primary">
                  Next <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && formData.namaPelayanan === "Pendeta" && (
            <form onSubmit={handleNextAfterPelayanan}>
              <h4 className="mb-3 text-center">Form Data Pelayanan Pendeta</h4>

              <label className="form-label">Jabatan</label>
              <select
                name="dataPendeta.jabatan"
                className="form-select mb-4"
                value={formData.dataPendeta?.jabatan || ""}
                onChange={handleChange}
              >
                <option value="">-- Pilih Jabatan --</option>
                <option value="Ketua Majelis Jemaat">Ketua Majelis Jemaat</option>
                <option value="Pendeta Jemaat">Pendeta Jemaat</option>
                <option value="Pendeta Pembantu">Pendeta Pembantu</option>
                <option value="Pendeta Emeritus">Pendeta Emeritus</option>
              </select>

              <h4 className="text-center mb-3">Riwayat Pelayanan</h4>

              {pelayananList.map((pel, index) => (
                <div className="row g-2 mb-3 align-items-end" key={index}>
                  <div className="col-md-5">
                    <label className="form-label">Nama Gereja</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pel.namaGereja}
                      onChange={(e) =>
                        handlePelayananChange(index, "namaGereja", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Mulai</label>
                    <input
                      type="number"
                      className="form-control"
                      value={pel.tahunMulai}
                      onChange={(e) =>
                        handlePelayananChange(index, "tahunMulai", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Selesai</label>
                    <input
                      type="number"
                      className="form-control"
                      value={pel.tahunSelesai}
                      onChange={(e) =>
                        handlePelayananChange(index, "tahunSelesai", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-1">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removePelayanan(index)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-primary btn-sm mb-3"
                onClick={addPelayanan}
              >
                + Tambah Riwayat
              </button>

              <div className="text-end">
                <button type="submit" className="btn btn-primary">
                  Next <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <div className="row">

                {/* Nikah */}
                {showNikah && (
                  <div className="col-md-4 mb-3">
                    <h5 className="mb-2 text-center">Informasi Nikah</h5>

                    <label className="form-label">Tanggal Nikah</label>
                    <input
                      type="date"
                      name="tanggalNikah"
                      className="form-control mb-2"
                      value={formData.tanggalNikah}
                      onChange={handleChange}
                    />

                    <label className="form-label">Tempat Nikah</label>
                    <input
                      type="text"
                      name="tempatNikah"
                      className="form-control mb-2"
                      value={formData.tempatNikah}
                      onChange={handleChange}
                    />

                    <label className="form-label">Nama Pasangan</label>
                    <input
                      type="text"
                      name="namaPasangan"
                      className="form-control mb-2"
                      value={formData.namaPasangan}
                      onChange={handleChange}
                    />

                    <label className="form-label">Gereja Asal Pasangan</label>
                    <input
                      type="text"
                      name="gerejaAsal"
                      className="form-control mb-2"
                      value={formData.gerejaAsal}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* Sidi */}
                {showSidi && (
                  <div className="col-md-4 mb-3">
                    <h5 className="mb-2 text-center">Informasi Sidi</h5>

                    <label className="form-label">Tanggal Sidi</label>
                    <input
                      type="date"
                      name="tanggalSidi"
                      className="form-control mb-2"
                      value={formData.tanggalSidi}
                      onChange={handleChange}
                    />

                    <label className="form-label">Tempat Sidi</label>
                    <input
                      type="text"
                      name="tempatSidi"
                      className="form-control mb-2"
                      value={formData.tempatSidi}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* Baptis */}
                {showBaptis && (
                  <div className="col-md-4 mb-3">
                    <h5 className="mb-2 text-center">Informasi Baptis</h5>

                    <label className="form-label">Tanggal Baptis</label>
                    <input
                      type="date"
                      name="tanggalBaptis"
                      className="form-control mb-2"
                      value={formData.tanggalBaptis}
                      onChange={handleChange}
                    />

                    <label className="form-label">Tempat Baptis</label>
                    <input
                      type="text"
                      name="tempatBaptis"
                      className="form-control mb-2"
                      value={formData.tempatBaptis}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* Meninggal */}
                {showMeninggal && (
                  <div className="col-md-4 mb-3">
                    <h5 className="mb-2 text-center">Informasi Meninggal</h5>

                    <label className="form-label">Tanggal Meninggal</label>
                    <input
                      type="date"
                      name="tanggalMeninggal"
                      className="form-control mb-2"
                      value={formData.tanggalMeninggal}
                      onChange={handleChange}
                    />

                    <label className="form-label">Tempat Meninggal</label>
                    <input
                      type="text"
                      name="tempatMeninggal"
                      className="form-control mb-2"
                      value={formData.tempatMeninggal}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              <div className="text-end mt-4">
                <button type="submit" className="btn btn-success">
                  <FontAwesomeIcon icon={faSave} /> Simpan Data
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
      <Footer/>
    </>
  );
};

export default HalamanTambahDataBaru;
