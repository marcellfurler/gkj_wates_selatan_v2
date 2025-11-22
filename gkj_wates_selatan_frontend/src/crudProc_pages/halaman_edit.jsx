import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import { NavbarComponent } from "../components/NavbarComponent";

const EditJemaat = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state || !state.data) {
      alert("Data jemaat tidak ditemukan!");
      navigate("/data");
    }
  }, [state, navigate]);

  const [formData, setFormData] = useState(
    state?.data || {
      kodeJemaat: "",
      namaLengkap: "",
      tempatLahir: "",
      tanggalLahir: "",
      jenisKelamin: "",
      agama: "",
      golonganDarah: "",
      wargaNegara: "",
      nomorTelepon: "",
      alamat: "",
      namaPepanthan: "",
      statusSidi: "",
      statusBaptis: "",
      statusNikah: "",
      namaPelayanan: "",
      namaPekerjaan: "",
      jabatan: "",
      foto: "",
      sertifikatBaptis: state?.data?.sertifikatBaptis || null,
      sertifikatSidi: state?.data?.sertifikatSidi || null,
      sertifikatNikah: state?.data?.sertifikatNikah || null,
    }
  );

  // const [pendidikanList, setPendidikanList] = useState(
  //   state?.data?.pendidikanList || [
  //     { jenjangPendidikan: "", namaInstitusi: "", tahunLulus: "" },
  //   ]
  // );

  const [selectedFile, setSelectedFile] = useState(null);
  const [statusFileMap, setStatusFileMap] = useState({}); // untuk upload file baru per status
  const [deleteStatus, setDeleteStatus] = useState([]);
  const [initialStatus, setInitialStatus] = useState({
    baptis: formData.statusBaptis,
    sidi: formData.statusSidi,
    nikah: formData.statusNikah,
  });

  // Update form biasa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // // Pendidikan dinamis
  // const handlePendidikanChange = (index, field, value) => {
  //   const newList = [...pendidikanList];
  //   newList[index][field] = value;
  //   setPendidikanList(newList);
  // };

  // const addPendidikan = () => {
  //   setPendidikanList([
  //     ...pendidikanList,
  //     { jenjangPendidikan: "", namaInstitusi: "", tahunLulus: "" },
  //   ]);
  // };

  // const removePendidikan = (index) => {
  //   const newList = [...pendidikanList];
  //   newList.splice(index, 1);
  //   setPendidikanList(newList);
  // };

  // Upload file foto
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload file sertifikat per status
  const handleStatusFileChange = (status, file) => {
    setStatusFileMap({ ...statusFileMap, [status]: file });
  };

  // Hapus sertifikat
  const handleDeleteStatus = (status) => {
    setFormData({
      ...formData,
      [`status${status}`]: `Belum ${status}`,
      [`sertifikat${status}`]: null,
    });
    setDeleteStatus((prev) => [...prev, status.toLowerCase()]);
  };

  // Submit form
// Submit form
const handleSubmit = async (e) => {
  e.preventDefault();
  const kodeJemaat = formData.kodeJemaat;

  // Buat FormData untuk dikirim
  const fd = new FormData();

  // Append semua field kecuali foto
  for (const key in formData) {
    if (key === "foto") continue; // foto ditangani terpisah
    fd.append(key, formData[key] ?? "");
  }

  // Append foto jika ada
  if (formData.foto) {
    fd.append("foto", formData.foto);
  }

  try {
    const res = await fetch(`http://localhost:5000/api/jemaat/${kodeJemaat}`, {
      method: "PUT",
      body: fd,
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Data jemaat berhasil diperbarui!");
      navigate(-1);
    } else {
      alert("❌ " + (data.message || "Gagal memperbarui data jemaat."));
    }
  } catch (err) {
    console.error("❌ Error saat update:", err);
  }





    // Append pendidikanList
    // formDataToSend.append("pendidikanList", JSON.stringify(pendidikanList));

    // Sertifikat baru untuk status
    Object.keys(statusFileMap).forEach((status) => {
      if (statusFileMap[status]) {
        const fieldName = `sertifikat${status.charAt(0).toUpperCase() + status.slice(1)}`; // contoh: 'baptis' → 'sertifikatBaptis'
        formDataToSend.append(fieldName, statusFileMap[status]);
      }
    });


    // Delete status
    if (deleteStatus.length > 0) {
      formDataToSend.append("deleteStatus", JSON.stringify(deleteStatus));
    }

    try {
      const res = await fetch(`http://localhost:5000/api/jemaat/${kodeJemaat}`, {
        method: "PUT",
        body: formDataToSend,
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Data jemaat berhasil diperbarui!");
        navigate(-1);
      } else {
        alert("❌ " + (data.message || "Gagal memperbarui data jemaat."));
      }
    } catch (err) {
      console.error("❌ Error saat update:", err);
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="container my-5">
        <div className="card shadow border-0 mb-4" style={{ borderRadius: "12px" }}>
          <div
            className="card-header text-white d-flex align-items-center justify-content-center position-relative"
            style={{ backgroundColor: "#004d97", borderBottom: "none", height: "60px" }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-light btn-sm fw-bold position-absolute start-0 ms-3"
              style={{ color: "#004d97" }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Kembali
            </button>
            <h5 className="mb-0 fw-bold text-center flex-grow-1">EDIT DATA JEMAAT</h5>
          </div>

          <div className="card-body p-4 bg-light">
            <form onSubmit={handleSubmit} className="row g-3">
              {/* Kolom kiri */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Nama Lengkap</label>
                <input type="text" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} className="form-control" required />

                <label className="form-label fw-bold mt-3">Tempat Lahir</label>
                <input type="text" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} className="form-control" />

                <label className="form-label fw-bold mt-3">Jenis Kelamin</label>
                <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className="form-select">
                  <option value="">Pilih...</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>

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

                <label className="form-label fw-bold mt-3">Nama Pekerjaan</label>
                <input type="text" name="namaPekerjaan" value={formData.namaPekerjaan || ""} onChange={handleChange} className="form-control" />

                <label className="form-label fw-bold mt-3">Jabatan</label>
                <input type="text" name="jabatan" value={formData.jabatan || ""} onChange={handleChange} className="form-control" />
              </div>

              {/* Kolom kanan */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Golongan Darah</label>
                <select name="golonganDarah" value={formData.golonganDarah} onChange={handleChange} className="form-select">
                  <option value="">Pilih...</option>
                  <option value="A">A</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                  <option value="B">B</option>
                </select>

                <label className="form-label fw-bold mt-3">Tanggal Lahir</label>
                <input type="date" name="tanggalLahir" value={formData.tanggalLahir?.substring(0, 10) || ""} onChange={handleChange} className="form-control" />

                <label className="form-label fw-bold mt-3">Telepon</label>
                <input type="text" name="nomorTelepon" value={formData.nomorTelepon || ""} onChange={handleChange} className="form-control" />

                <label className="form-label fw-bold mt-3">Alamat</label>
                <input type="text" name="alamat" value={formData.alamat || ""} onChange={handleChange} className="form-control" />

                <label className="form-label fw-bold mt-3">Foto Profil</label>
                <input type="file" accept="image/*" className="form-control" onChange={(e) => setFormData({ ...formData, foto: e.target.files[0] })} />
              </div>

              {/* Pendidikan Dinamis
              <div className="col-12 mt-4">
                <hr />
                <h6 className="fw-bold text-primary mb-3">Pendidikan</h6>
                {pendidikanList.map((pend, index) => (
                  <div className="row g-2 mb-2 align-items-end" key={index}>
                    <div className="col-md-4">
                      <label className="form-label">Jenjang</label>
                      <input type="text" className="form-control" value={pend.jenjangPendidikan} onChange={(e) => handlePendidikanChange(index, "jenjangPendidikan", e.target.value)} />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label">Nama Institusi</label>
                      <input type="text" className="form-control" value={pend.namaInstitusi} onChange={(e) => handlePendidikanChange(index, "namaInstitusi", e.target.value)} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Tahun Lulus</label>
                      <input type="number" className="form-control" value={pend.tahunLulus} onChange={(e) => handlePendidikanChange(index, "tahunLulus", e.target.value)} />
                    </div>
                    <div className="col-md-1">
                      <button type="button" className="btn btn-danger" onClick={() => removePendidikan(index)}>
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-primary mt-2" onClick={addPendidikan}>
                  + Tambah Pendidikan
                </button>
              </div> */}

              {/* Status Gerejawi */}
              <div className="col-12 mt-4">
                <hr />
                <h6 className="fw-bold text-primary mb-3">Status Gerejawi</h6>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Pepanthan</label>
                    <select name="namaPepanthan" value={formData.namaPepanthan} onChange={handleChange} className="form-select">
                      <option value="">Pilih...</option>
                      <option value="Induk Depok">Induk Depok</option>
                      <option value="Triharjo">Triharjo</option>
                      <option value="Wonogiri">Wonogiri</option>
                      <option value="Galur">Galur</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Status Pelayanan</label>
                    <select 
                      name="namaPelayanan" 
                      value={formData.namaPelayanan || ""} 
                      onChange={handleChange} 
                      className="form-select"
                    >
                      <option value="">--Pilih--</option>
                      <option value="Jemaat">Jemaat</option>
                      <option value="Pendeta">Pendeta</option>
                      <option value="Majelis">Majelis</option>
                      <option value="Koordinator Pelayanan">Koordinator Pelayanan</option>
                      <option value="Meninggal">Meninggal</option>
                    </select>
                  </div>
                </div>

                {/* Baptis / Sidi / Nikah */}
                <div className="row">
                  {["Baptis", "Sidi", "Nikah"].map((status, i) => (
                    <div className="col-md-4" key={i}>

                      {/* LABEL */}
                      <label className="form-label fw-bold">Status {status}</label>

                      {/* DROPDOWN STATUS */}
                      <select
                        name={`status${status}`}
                        value={formData[`status${status}`] || ""}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">
                          {status === "Baptis"
                            ? "Belum Baptis"
                            : status === "Sidi"
                            ? "Belum Sidi"
                            : "Belum Nikah"}
                        </option>
                        <option value={status}>{status}</option>
                      </select>

                      {/* FORM DETAIL - MUNCUL JIKA STATUS DIPILIH */}
                      {formData[`status${status}`] === status && (
                        <div className="mt-3">

                          {/* === BAPTIS === */}
                          {status === "Baptis" && (
                            <>
                              <label className="form-label fw-bold">Tanggal Baptis</label>
                              <input
                                type="date"
                                name="tanggalBaptis"
                                value={formData.tanggalBaptis || ""}
                                onChange={handleChange}
                                className="form-control"
                              />

                              <label className="form-label fw-bold mt-2">Tempat Baptis</label>
                              <input
                                type="text"
                                name="tempatBaptis"
                                value={formData.tempatBaptis || ""}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </>
                          )}

                          {/* === SIDI === */}
                          {status === "Sidi" && (
                            <>
                              <label className="form-label fw-bold">Tanggal Sidi</label>
                              <input
                                type="date"
                                name="tanggalSidi"
                                value={formData.tanggalSidi || ""}
                                onChange={handleChange}
                                className="form-control"
                              />

                              <label className="form-label fw-bold mt-2">Tempat Sidi</label>
                              <input
                                type="text"
                                name="tempatSidi"
                                value={formData.tempatSidi || ""}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </>
                          )}

                          {/* === NIKAH === */}
                          {status === "Nikah" && (
                            <>
                              <label className="form-label fw-bold">Tanggal Nikah</label>
                              <input
                                type="date"
                                name="tanggalNikah"
                                value={formData.tanggalNikah || ""}
                                onChange={handleChange}
                                className="form-control"
                              />

                              <label className="form-label fw-bold mt-2">Tempat Nikah</label>
                              <input
                                type="text"
                                name="tempatNikah"
                                value={formData.tempatNikah || ""}
                                onChange={handleChange}
                                className="form-control"
                              />

                              <label className="form-label fw-bold mt-2">Nama Pasangan</label>
                              <input
                                type="text"
                                name="namaPasangan"
                                value={formData.namaPasangan || ""}
                                onChange={handleChange}
                                className="form-control"
                              />

                              <label className="form-label fw-bold mt-2">Gereja Asal</label>
                              <input
                                type="text"
                                name="gerejaAsal"
                                value={formData.gerejaAsal || ""}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="col-12 text-end mt-4">
                <button type="submit" className="btn fw-bold text-white px-4" style={{ backgroundColor: "#004d97", borderRadius: "8px" }}>
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditJemaat;