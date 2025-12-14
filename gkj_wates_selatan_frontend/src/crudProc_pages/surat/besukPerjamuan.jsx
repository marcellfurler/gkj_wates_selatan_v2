import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";

const BesukPerjamuan = () => {
  const navigate = useNavigate();

  // STATE UTAMA
  const [formData, setFormData] = useState({
    wilayah: "",
    tanggal: "",
    wargaDewasa: "",
    telahDibesuk: "",
    belumDibesuk: "",
    tempatLain: "",
    titipan: "",
    ikutPerjamuan: "",
    keliling: "",
  });

  const [jumlahKeseluruhan, setJumlahKeseluruhan] = useState(0);

  const [daftarHadir, setDaftarHadir] = useState([]);
  const [tidakHadir, setTidakHadir] = useState([{ nama: "", keterangan: "" }]);
  const [wilayahLain, setWilayahLain] = useState([{ nama: "", keterangan: "" }]);
  const [tamuGereja, setTamuGereja] = useState([{ nama: "", keterangan: "" }]);
  const [mengetahui, setMengetahui] = useState([
    { nama: "", tandaTangan: "" },
    { nama: "", tandaTangan: "" },
  ]);

  // ========== FIX VALUE NUMBER ==========
  const fixNumber = (num) => {
    return num === "" || num === null || isNaN(num) ? 0 : parseInt(num);
  };

  // ========== HANDLE CHANGE ==========
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    const newValue =
      type === "number" ? (value === "" ? "" : parseInt(value)) : value;

    if (name === "keliling") {
      const jumlah = newValue === "" ? 0 : newValue;
      const newRows = Array.from(
        { length: jumlah },
        (_, i) => daftarHadir[i] || { nama: "", keterangan: "" }
      );
      setDaftarHadir(newRows);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  // ========== HANDLE LIST TABLE ==========
  const handleListChange = useCallback((setter, list, index, field, value) => {
    const updated = [...list];
    updated[index][field] = value;
    setter(updated);
  }, []);

  const handleAddRow = useCallback((setter, list) => {
    setter([...list, { nama: "", keterangan: "" }]);
  }, []);

  // ========== HITUNG TOTAL OTOMATIS ==========
  useEffect(() => {
    const jumlahHadir = daftarHadir.filter((i) => i.nama.trim() !== "").length;
    const jumlahWilayahLain = wilayahLain.filter((i) => i.nama.trim() !== "").length;
    const jumlahTamu = tamuGereja.filter((i) => i.nama.trim() !== "").length;

    const ikut = fixNumber(formData.ikutPerjamuan);

    const total = jumlahHadir + jumlahWilayahLain + jumlahTamu + ikut;

    if (total !== jumlahKeseluruhan) setJumlahKeseluruhan(total);
  }, [daftarHadir, wilayahLain, tamuGereja, formData.ikutPerjamuan]);

  // ========== HANDLE SUBMIT ==========
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataInputLengkap = {
      wilayah: formData.wilayah,
      tanggal: formData.tanggal,

      // STATISTIK (dibetulkan datanya)
      wargaDewasa: fixNumber(formData.wargaDewasa),
      telahDibesuk: fixNumber(formData.telahDibesuk),
      belumDibesuk: fixNumber(formData.belumDibesuk),
      tempatLain: fixNumber(formData.tempatLain),
      titipan: fixNumber(formData.titipan),

      ikutPerjamuan: fixNumber(formData.ikutPerjamuan),
      keliling: fixNumber(formData.keliling),

      jumlahKeseluruhan: jumlahKeseluruhan,

      daftarHadir: daftarHadir.filter((i) => i.nama.trim() !== ""),
      tidakHadir: tidakHadir.filter((i) => i.nama.trim() !== ""),
      wilayahLain: wilayahLain.filter((i) => i.nama.trim() !== ""),
      tamuGereja: tamuGereja.filter((i) => i.nama.trim() !== ""),
      mengetahui: mengetahui.filter((i) => i.nama.trim() !== ""),
    };

    const payloadToBackend = {
      kodeTipeSurat: "BESUK_PERJAMUAN",
      judul_surat: `Laporan Perjamuan ${formData.wilayah || "Anonim"} Tgl: ${
        formData.tanggal || "Tanpa Tanggal"
      }`,
      data_input_json: dataInputLengkap,
    };

    let isSavedSuccessfully = false;

    try {
      const response = await fetch("http://localhost:5000/api/surat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToBackend),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Surat berhasil disimpan. ID Transaksi: ${result.kodeSurat}`);
        isSavedSuccessfully = true;
      } else {
        alert(`Gagal: ${result.message}`);
      }
    } catch (error) {
      alert("Gagal menyimpan. Pastikan server aktif.");
    }

    if (isSavedSuccessfully) {
      navigate("/surat/hasil/besuk-perjamuan", { state: dataInputLengkap });
    }
  };

  // ========== KOMPONEN TABEL DINAMIS ==========
  const DynamicTable = useCallback(
    ({ title, list, setter }) => (
      <div className="mb-4">
        <h6 className="fw-bold text-primary mt-3">{title}</h6>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th style={{ width: "5%" }}>No</th>
              <th style={{ width: "45%" }}>Nama</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={row.nama}
                    onChange={(e) =>
                      handleListChange(setter, list, i, "nama", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={row.keterangan}
                    onChange={(e) =>
                      handleListChange(
                        setter,
                        list,
                        i,
                        "keterangan",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => handleAddRow(setter, list)}
        >
          + Tambah Baris
        </button>
      </div>
    ),
    [handleListChange, handleAddRow]
  );

  // ========== RENDER UI ==========
  return (
    <div>
      <NavbarComponent />
      <div className="container mt-4 mb-5">
        <div className="card shadow-lg">
          <div
            className="card-header d-flex align-items-center justify-content-between text-white px-4 py-3"
            style={{ backgroundColor: "#004d97" }}
          >
            <div className="d-flex align-items-center gap-3 w-100 justify-content-between">
              <button className="btn btn-light btn-sm fw-bold" onClick={() => navigate(-1)}>
                ←Kembali
              </button>
              <h4 className="text-center flex-grow-1 m-0 w-100">
                🕊️ Form Laporan Besuk / Pendadaran Perjamuan Kudus
              </h4>
            </div>
          </div>

          <div className="card-body px-4 py-4">
            <form onSubmit={handleSubmit}>
              <h5 className="fw-bold text-primary mb-3">📋 Data Wilayah / Pepanthan</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Wilayah / Pepanthan</label>
                  <select
                    className="form-select"
                    name="wilayah"
                    value={formData.wilayah}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih Wilayah --</option>
                    <option value="Pepanthan Triharjo">Pepanthan Triharjo</option>
                    <option value="Pepanthan Depok">Pepanthan Depok</option>
                    <option value="Pepanthan Wonogiri">Pepanthan Wonogiri</option>
                    <option value="Pepanthan Galur">Pepanthan Galur</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr className="my-4" />
              <h5 className="fw-bold text-success mb-3">📊 Statistik Warga Perjamuan</h5>

              <div className="row g-3">
                {[
                  ["Jumlah Warga Dewasa", "wargaDewasa"],
                  ["Telah di Besuk", "telahDibesuk"],
                  ["Belum di Besuk", "belumDibesuk"],
                  ["Pergi ke Tempat Lain", "tempatLain"],
                  ["Titipan ke Gereja Lain", "titipan"],
                ].map(([label, name]) => (
                  <div className="col-md-4" key={name}>
                    <label className="form-label fw-bold">{label}</label>
                    <input
                      type="number"
                      className="form-control"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>

              <hr className="my-4" />
              <h5 className="fw-bold text-danger mb-3">🙏 Pelaksanaan Perjamuan Kudus</h5>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Warga yang ikut Perjamuan</label>
                  <input
                    type="number"
                    className="form-control"
                    name="ikutPerjamuan"
                    value={formData.ikutPerjamuan}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold">Pelayanan Keliling (Warga sakit, Jompo)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="keliling"
                    value={formData.keliling}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <DynamicTable title="✅ Warga Pelayanan Keliling" list={daftarHadir} setter={setDaftarHadir} />
              <DynamicTable title="🚫 Warga Tidak Hadir" list={tidakHadir} setter={setTidakHadir} />
              <DynamicTable title="🏠 Dari Wilayah Lain" list={wilayahLain} setter={setWilayahLain} />
              <DynamicTable title="🙌 Warga Tamu Gereja Lain" list={tamuGereja} setter={setTamuGereja} />

              <div className="mt-3">
                <label className="form-label fw-bold">Jumlah Pengikut Perjamuan Kudus Seluruhnya</label>
                <input type="number" className="form-control" value={jumlahKeseluruhan} readOnly />
              </div>

              <hr className="my-4" />
              <h5 className="fw-bold text-primary mb-3">✍️ Mengetahui Majelis</h5>

              <DynamicTable
                title="Nama Majelis dan Tanda Tangan"
                list={mengetahui}
                setter={setMengetahui}
              />

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

export default BesukPerjamuan;
