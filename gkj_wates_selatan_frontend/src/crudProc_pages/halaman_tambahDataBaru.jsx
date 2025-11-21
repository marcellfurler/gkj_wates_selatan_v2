import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSave,
  faArrowRight,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { NavbarComponent } from "../components/NavbarComponent";
import dataJemaat from "../data/dataJemaat.json";

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
    nomorTelepon: "",
    pepanthan: "",
    namaPelayanan: "",
    statusSidi: "",
    statusBaptis: "",
    statusNikah: "",
    dataPendeta: {},
    dataNikah: {},
    dataSidi: {},
    dataBaptis: {},
    foto: "",
  });

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewFoto(URL.createObjectURL(file)); // untuk preview
      setFormData({ ...formData, foto: file }); // simpan File object
    }
  };


  const handleNext = (e) => {
    e.preventDefault();
    if (
      formData.namaPelayanan === "Pendeta"
    ) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleNextAfterPelayanan = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (step === 2) setStep(1);
    else if (step === 3) {
      if (
        formData.namaPelayanan === "Pendeta"
      ) {
        setStep(2);
      } else {
        setStep(1);
      }
    }

    
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Tentukan endpoint
    const isPendeta = formData.namaPelayanan === "Pendeta";
    const apiEndpoint = isPendeta ? 
        "http://localhost:5000/api/jemaat/pendeta" : 
        "http://localhost:5000/api/jemaat"; 

    try {
        const form = new FormData();

        // === DATA DASAR JEMAAT ===
        form.append("namaLengkap", formData.namaLengkap || "");
        form.append("kodeJemaat", formData.kodeJemaat || "");
        form.append("alamat", formData.alamat || "");
        form.append("tempatLahir", formData.tempatLahir || "");
        form.append("tanggalLahir", formData.tanggalLahir || "");
        form.append("jenisKelamin", formData.jenisKelamin || "");
        form.append("agama", formData.agama || "");
        form.append("golonganDarah", formData.golonganDarah || "");
        form.append("nomorTelepon", formData.nomorTelepon || "");
        form.append("pepanthan", formData.pepanthan || "");
        form.append("statusNikah", formData.statusNikah || "");
        form.append("statusSidi", formData.statusSidi || "");
        form.append("statusBaptis", formData.statusBaptis || "");
        
        // Data Pekerjaan
        form.append("namaPekerjaan", formData.namaPekerjaan || "");
        form.append("jabatan", formData.jabatan || ""); // Jabatan Pekerjaan
        form.append("namaPelayanan", formData.namaPelayanan || ""); 

        // File Foto
        if (formData.foto instanceof File) {
            form.append("foto", formData.foto);
        }

        // === DATA PENDETA/RIWAYAT (Payload ke /api/pendeta) ===
        if (isPendeta) {
            // ✅ Menggunakan dataPendeta untuk jabatan spesifik
            form.append("jabatanPendeta", formData.dataPendeta?.jabatan || ""); 
            
            // Sertifikat Pendeta
            if (formData.dataPendeta?.sertifikat instanceof File) {
                form.append("sertifikatPendeta", formData.dataPendeta.sertifikat);
            }
            // Riwayat Pelayanan Dinamis
            if (formData.dataPelayananList && formData.dataPelayananList.length > 0) {
                // Backend akan parse field ini
                form.append("dataPelayananList", JSON.stringify(formData.dataPelayananList));
            }
        }

        // === SERTIFIKAT LAIN & PENDIDIKAN (Payload untuk kedua endpoint) ===
        // Sertifikat Nikah/Sidi/Baptis
        if (!isPendeta || step === 3) {
            if (formData.dataNikah?.sertifikat instanceof File) { form.append("sertifikatNikah", formData.dataNikah.sertifikat); }
            if (formData.dataSidi?.sertifikat instanceof File) { form.append("sertifikatSidi", formData.dataSidi.sertifikat); }
            if (formData.dataBaptis?.sertifikat instanceof File) { form.append("sertifikatBaptis", formData.dataBaptis.sertifikat); }
            
        }

        // Pendidikan Dinamis
        if (formData.pendidikan && formData.pendidikan.length > 0) {
            // Backend akan parse field ini
            form.append("pendidikan", JSON.stringify(formData.pendidikan));
        }

        // Kirim ke backend
        const res = await fetch(apiEndpoint, {
            method: "POST",
            body: form,
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message || "Data jemaat berhasil ditambahkan!");
            navigate("/data");
        } else {
            alert(data.message || "Gagal menambahkan data jemaat. Cek log server.");
            console.error(data);
        }
    } catch (error) {
        console.error("Error submit:", error);
        alert("Terjadi kesalahan saat mengirim data.");
    }
};


  // === PENDIDIKAN DINAMIS ===
  const [pendidikanList, setPendidikanList] = useState([
    { jenjangPendidikan: "", namaInstitusi: "", tahunLulus: "" },
  ]);

  const handlePendidikanChange = (index, field, value) => {
    const updated = [...pendidikanList];
    updated[index][field] = value;
    setPendidikanList(updated);

    // masukkan juga ke formData supaya ikut terkirim
    setFormData({
      ...formData,
      pendidikan: updated,
    });
  };

  const addPendidikan = () => {
    const newList = [
      ...pendidikanList,
      { jenjangPendidikan: "", namaInstitusi: "", tahunLulus: "" },
    ];
    setPendidikanList(newList);
    setFormData({ ...formData, pendidikan: newList });
  };

  const removePendidikan = (index) => {
    const newList = pendidikanList.filter((_, i) => i !== index);
    setPendidikanList(newList);
    setFormData({ ...formData, pendidikan: newList });
  };

  // Riwayat Pelayanan Dinamis
  const [pelayananList, setPelayananList] = useState([
    { namaGereja: "", tahunMulai: "", tahunSelesai: "" },
  ]);

  const handlePelayananChange = (index, field, value) => {
    const updated = [...pelayananList];
    updated[index][field] = value;
    setPelayananList(updated);

    // simpan juga ke formData supaya terkirim
    setFormData({
      ...formData,
      dataPelayananList: updated,
    });
  };

  const addPelayanan = () => {
    const newList = [
      ...pelayananList,
      { namaGereja: "", tahunMulai: "", tahunSelesai: "" },
    ];
    setPelayananList(newList);
    setFormData({ ...formData, dataPelayananList: newList });
  };

  const removePelayanan = (index) => {
    const newList = pelayananList.filter((_, i) => i !== index);
    setPelayananList(newList);
    setFormData({ ...formData, dataPelayananList: newList });
  };




  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  const showNikah =
    formData.statusNikah === "Nikah" 

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
              ? "Tambah Data Jemaat Baru"
              : step === 2
              ? "Form Data Pelayanan"
              : "Form Data Tambahan"}
          </h3>
          <div style={{ width: "80px" }}></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="progress" style={{ height: "20px" }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
              role="progressbar"
              style={{ width: `${progress}%` }}
            >
              Step {step} / 3
            </div>
          </div>
        </div>

        <div className="card shadow p-4">
          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleNext}>
              {/* Informasi Diri */}
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

                  <label className="form-label ">Tempat Lahir</label>
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
                    placeholder="0812xxxxxxx"
                  />

                  <label className="form-label">Agama</label>
                  <select name="agama" value={formData.agama} onChange={handleChange} className="form-select mb-3">
                    <option value="">Pilih...</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Budha">Budha</option>
                    <option value="Islam">Islam</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>

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
                  <select name="golonganDarah" value={formData.golonganDarah} onChange={handleChange} className="form-select mb-3">
                    <option value="">Pilih...</option>
                    <option value="A">A</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                    <option value="B">B</option>
                  </select>


                  <label className="form-label">
                    <FontAwesomeIcon icon={faImage} className="me-2" />
                    Upload Foto Jemaat
                  </label>
                  <input
                    type="file"
                    name="foto"
                    accept="image/*,application/pdf"
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
                  
            <h4 className="mb-3">Pekerjaan</h4>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Nama Pekerjaan</label>
                  <input
                    type="text"
                    name="namaPekerjaan"
                    className="form-control mb-3"
                    value={formData.namaPekerjaan}
                    onChange={handleChange}
                  />

                  <label className="form-label ">Jabatan</label>
                  <input
                    type="text"
                    name="jabatan"
                    className="form-control mb-3"
                    value={formData.jabatan}
                    onChange={handleChange}
                  />

                </div>
              </div>
              <hr />
              


            {/* Pendidikan Dinamis */}
            <div className="col-12 mt-4">
              
              <h4 className="mb-3">Pendidikan</h4>

              {pendidikanList.map((pend, index) => (
                <div className="row g-2 mb-3 align-items-end" key={index}>
                  
                  {/* Jenjang */}
                  <div className="col-md-3">
                    <label className="form-label">Jenjang</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="SMA / S1 / S2"
                      value={pend.jenjangPendidikan}
                      onChange={(e) =>
                        handlePendidikanChange(index, "jenjangPendidikan", e.target.value)
                      }
                    />
                  </div>

                  {/* Institusi */}
                  <div className="col-md-6">
                    <label className="form-label">Nama Institusi</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama sekolah / universitas"
                      value={pend.namaInstitusi}
                      onChange={(e) =>
                        handlePendidikanChange(index, "namaInstitusi", e.target.value)
                      }
                    />
                  </div>

                  {/* Tahun */}
                  <div className="col-md-2">
                    <label className="form-label">Tahun Lulus</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="2020"
                      min="1950"
                      max={new Date().getFullYear()}
                      value={pend.tahunLulus}
                      onChange={(e) =>
                        handlePendidikanChange(index, "tahunLulus", e.target.value)
                      }
                    />
                  </div>

                  {/* Hapus */}
                  <div className="col-md-1">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removePendidikan(index)}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-sm btn-primary mt-2"
                onClick={addPendidikan}
              >
                + Tambah Pendidikan
              </button>
            </div>



              <hr />

              {/* Gerejawi */}
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
                    <option value="Induk Depok">Induk Depok</option>
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
                    name="namaPelayanan"   // ini ganti
                    className="form-select mb-3"
                    value={formData.namaPelayanan}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Jemaat">Jemaat</option>
                    <option value="Pendeta">Pendeta</option>
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

          {/* STEP 2 */}
          {step === 2 && formData.namaPelayanan === "Pendeta" && (
            <form onSubmit={handleNextAfterPelayanan}>
              <h4 className="mb-3 text-center">Form Data Pelayanan GKJ Wates Selatan</h4>

              <div className="row">
                {/* Upload Sertifikat Pendeta */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Sertifikat Pendeta</label>
                  <input
                    type="file"
                    name="sertifikatPendeta"
                    accept="image/*,application/pdf"
                    className="form-control"
                    onChange={(e) =>
                      setFormData((prevFormData) => ({ // 🔥 PERBAIKAN: Gunakan prevFormData
                        ...prevFormData,
                        dataPendeta: {
                            ...prevFormData.dataPendeta, // <- Mempertahankan data 'jabatan'
                            sertifikat: e.target.files[0],
                        },
                      }))
                    }
                  />
                  {formData.dataPendeta?.sertifikat && (
                    <p className="mt-1">{formData.dataPendeta.sertifikat.name}</p>
                  )}
                </div>

                {/* Pilih Jabatan */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Jabatan</label>
                  <select
                    name="dataPendeta.jabatan"
                    className="form-select mb-3"
                    value={formData.dataPendeta?.jabatan || ""}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih Jabatan --</option>
                    <option value="Ketua Majelis Jemaat">Ketua Majelis Jemaat</option>
                    <option value="Pendeta Jemaat">Pendeta Jemaat</option>
                    <option value="Pendeta Pembantu">Pendeta Pembantu</option>
                    <option value="Pendeta Emeritus">Pendeta Emeritus</option>
                  </select>
                </div>
              </div>

              {/* Riwayat Pelayanan Dinamis */}
              <div className="col-12 mt-4">
                <h4 className="mb-3 text-center">Riwayat Pelayanan</h4>

                {pelayananList.map((pel, index) => (
                  <div className="row g-2 mb-3 align-items-end" key={index}>
                    {/* Nama Gereja */}
                    <div className="col-md-5">
                      <label className="form-label">Nama Gereja</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nama Gereja"
                        value={pel.namaGereja}
                        onChange={(e) =>
                          handlePelayananChange(index, "namaGereja", e.target.value)
                        }
                      />
                    </div>

                    {/* Tahun Mulai */}
                    <div className="col-md-2">
                      <label className="form-label">Tahun Mulai</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="2000"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={pel.tahunMulai}
                        onChange={(e) =>
                          handlePelayananChange(index, "tahunMulai", e.target.value)
                        }
                      />
                    </div>

                    {/* Tahun Selesai */}
                    <div className="col-md-2">
                      <label className="form-label">Tahun Selesai</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="2023"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={pel.tahunSelesai}
                        onChange={(e) =>
                          handlePelayananChange(index, "tahunSelesai", e.target.value)
                        }
                      />
                    </div>

                    {/* Hapus */}
                    <div className="col-md-1">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removePelayanan(index)}
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-sm btn-primary mt-2"
                  onClick={addPelayanan}
                >
                  + Tambah Riwayat Pelayanan
                </button>
              </div>

              <div className="text-end mt-4">
                <button type="submit" className="btn btn-primary">
                  Next <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </form>
          )}



          {/* STEP 3 – UPLOAD SERTIFIKAT */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <div className="row">
                {showNikah && (
                  <div className="col-md-4 mb-6">
                    <h5 className="text-center mb-2">Informasi Nikah</h5>

                    {/* Tanggal Meninggal */}
                    <label className="form-label">Tanggal Nikah</label>
                    <input
                      type="date"
                      name="tanggalNikah"
                      className="form-control mb-2"
                      value={formData.tanggalNikah || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggalNikah: e.target.value,
                        })
                      }
                    />

                    {/* Tempat Meninggal */}
                    <label className="form-label">Tempat Nikah</label>
                    <input
                      type="text"
                      name="tempatNikah"
                      className="form-control mb-2"
                      placeholder="Masukkan tempat Menikah"
                      value={formData.tempatNikah || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tempatNikah: e.target.value,
                        })
                      }
                    />

                    <label className="form-label">Informasi Pasangan</label>
                    <input
                      type="text"
                      name="namaPasangan"
                      className="form-control mb-2"
                      placeholder="Masukkan tempat nama pasangan"
                      value={formData.namaPasangan || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          namaPasangan: e.target.value,
                        })
                      }
                    />
                    

                    <input
                      type="text"
                      name="gerejaAsal"
                      className="form-control mb-2"
                      placeholder="Masukkan gereja asal"
                      value={formData.gerejaAsal || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gerejaAsal: e.target.value,
                        })
                      }
                    />
                  </div>
                )}


                {showSidi && (
                  <div className="col-md-4 mb-3">
                    <h5 className="text-center mb-2">Informasi Sidi</h5>

                    {/* Tanggal Meninggal */}
                    <label className="form-label">Tanggal Sidi</label>
                    <input
                      type="date"
                      name="tanggalSidi"
                      className="form-control mb-2"
                      value={formData.tanggalSidi || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggalSidi: e.target.value,
                        })
                      }
                    />

                    {/* Tempat Meninggal */}
                    <label className="form-label">Tempat Sidi</label>
                    <input
                      type="text"
                      name="tempatSidi"
                      className="form-control"
                      placeholder="Masukkan tempat Sidi"
                      value={formData.tempatSidi || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tempatSidi: e.target.value,
                        })
                      }
                    />
                  </div>
                )}  

                {showBaptis && (
                  <div className="col-md-4 mb-3">
                    <h5 className="text-center mb-2">Informasi Baptis</h5>

                    {/* Tanggal Meninggal */}
                    <label className="form-label">Tanggal Baptis</label>
                    <input
                      type="date"
                      name="tanggalBaptis"
                      className="form-control mb-2"
                      value={formData.tanggalBaptis || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggalBaptis: e.target.value,
                        })
                      }
                    />

                    {/* Tempat Meninggal */}
                    <label className="form-label">Tempat Baptis</label>
                    <input
                      type="text"
                      name="tempatBaptis"
                      className="form-control"
                      placeholder="Masukkan tempat baptis"
                      value={formData.tempatBaptis || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tempatBaptis: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                {showMeninggal && (
                  <div className="col-md-4 mb-3">
                    <h5 className="text-center mb-2">Informasi Meninggal</h5>

                    {/* Tanggal Meninggal */}
                    <label className="form-label">Tanggal Meninggal</label>
                    <input
                      type="date"
                      name="tanggalMeninggal"
                      className="form-control mb-2"
                      value={formData.tanggalMeninggal || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggalMeninggal: e.target.value,
                        })
                      }
                    />

                    {/* Tempat Meninggal */}
                    <label className="form-label">Tempat Meninggal</label>
                    <input
                      type="text"
                      name="tempatMeninggal"
                      className="form-control"
                      placeholder="Masukkan tempat meninggal"
                      value={formData.tempatMeninggal || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tempatMeninggal: e.target.value,
                        })
                      }
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
    </>
  );
};

export default HalamanTambahDataBaru;
