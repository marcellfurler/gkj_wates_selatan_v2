import React, { useEffect, useState } from "react";
import { NavbarComponent } from "./components/NavbarComponent";
import DoughnutChart from "./components/charts/doughnut";
import BarChart from "./components/charts/barChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Footer from "./components/footer";


const HalamanStatistik = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("data");

  const [totalJemaat, setTotalJemaat] = useState(0);
  const [pepanthanData, setPepanthanData] = useState([]);
  const [genderData, setGenderData] = useState([]);

  const [nikahData, setNikahData] = useState(null);
  const [baptisData, setBaptisData] = useState(null);
  const [sidiData, setSidiData] = useState(null);
  const [meninggalData, setMeninggalData] = useState(null);

  // ===== Tambahan untuk filter tahun =====
  const [listTahun, setListTahun] = useState([]);
  const [tahunTerpilih, setTahunTerpilih] = useState(new Date().getFullYear());

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTabStatistik");
    if (savedTab) setActiveTab(savedTab);
    fetchListTahun();
  }, []);

  // ===== Fetch list tahun =====
  const fetchListTahun = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/statistik/tahun");
      const data = await res.json(); // data = [2025, 2024, 2023, ...]
      setListTahun(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Fetch data tiap kali tahunTerpilih berubah =====
  useEffect(() => {
    fetchTotalJemaat(tahunTerpilih);
    fetchPepanthanUsia(tahunTerpilih);
    fetchNikahData(tahunTerpilih);
    fetchBaptisData(tahunTerpilih);
    fetchSidiData(tahunTerpilih);
    fetchGenderData(tahunTerpilih);
    fetchMeninggalData(tahunTerpilih);
  }, [tahunTerpilih]);

  // ===== Fetch functions dengan parameter tahun =====
  const fetchTotalJemaat = async (tahun) => {
    try {
      const res = await fetch(`http://localhost:5000/api/statistik/total?tahun=${tahun}`);
      const data = await res.json();
      setTotalJemaat(data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPepanthanData = async (tahun) => {
    try {
      const res = await fetch(`http://localhost:5000/api/statistik/pepanthan?tahun=${tahun}`);
      const data = await res.json();

      const warna = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#004d97"];

      const mapped = data.map((item, i) => ({
        name: item.namaPepanthan,
        value: item.jumlah,
        color: warna[i % warna.length],
        rincian: item.rincian || [],
      }));

      setPepanthanData(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPepanthanUsia = async (tahun) => {
    try {
      const res = await fetch(`http://localhost:5000/api/statistik/pepanthan-usia?tahun=${tahun}`);
      const data = await res.json();

      const warna = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f"];
      const mapped = data.map((item, i) => ({
        name: item.name,
        color: warna[i % warna.length],
        rincian: item.rincian,
        value: item.rincian.length
      }));

      setPepanthanData(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGenderData = async (tahun) => {
    try {
      const res = await fetch(`http://localhost:5000/api/statistik/jenisKelamin?tahun=${tahun}`);
      const data = await res.json();
      setGenderData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNikahData = async (tahun) => {
    try {
      const res = await fetch(`http://localhost:5000/api/statistik/nikah?tahun=${tahun}`);
      const data = await res.json();
      setNikahData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBaptisData = async (tahun) => {
    try {
      const res = await fetch(`http://localhost:5000/api/statistik/baptis?tahun=${tahun}`);
      const data = await res.json();
      setBaptisData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSidiData = async (tahun) => {
    try {
      const res = await fetch(`http://localhost:5000/api/statistik/sidi?tahun=${tahun}`);
      const data = await res.json();
      setSidiData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMeninggalData = async (tahun) => {
    try {
      const res = await fetch(`http://localhost:5000/api/statistik/meninggal?tahun=${tahun}`);
      const data = await res.json();
      setMeninggalData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const renderMeninggalTable = (data) => {
    if (!data) return (
      <div className="card shadow-sm my-4">
        <div className="card-body text-center">Memuat data...</div>
      </div>
    );

    const total = data.total || 0;
    const rincian = data.rincianPepanthan || [];

    return (
      <div className="card shadow-sm my-4">
        <div className="card-header text-white" style={{ backgroundColor: "#004d97" }}>
          <h5 className="mb-0">Jemaat Meninggal</h5>
        </div>
        <div className="card-body">
          <p>Total jemaat yang meninggal: <b>{total} orang</b></p>

          <h6 className="mt-3 fw-bold">Rincian per Pepanthan:</h6>
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>No</th>
                <th>Pepanthan</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {rincian.length > 0
                ? rincian.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.namaPepanthan}</td>
                      <td>{item.jumlah}</td>
                    </tr>
                  ))
                : <tr><td colSpan="3">Tidak ada data</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderStatusTable = (title, data, type) => {
    if (!data) return (
      <div className="card shadow-sm my-4">
        <div className="card-body text-center">Memuat data...</div>
      </div>
    );

    const sudah = type === "nikah" ? data.nikah : data.sudah;
    const belum = type === "nikah" ? data.belumNikah : data.belum; 
    const rincian = data.rincianPepanthan || [];

    return (
      <div className="card shadow-sm my-4">
        <div className="card-header text-white" style={{ backgroundColor: "#004d97" }}>
          <h5 className="mb-0">{title}</h5>
        </div>
        <div className="card-body">
          <p>
            Informasi Jemaat yang sudah {type === "nikah" ? "Nikah" : type === "baptis" ? "Baptis" : "Sidi"}:{" "}
            <b>{sudah} orang</b>
          </p>
          <p>
            Informasi Jemaat yang belum {type === "nikah" ? "Nikah" : type === "baptis" ? "Baptis" : "Sidi"}:{" "}
            <b>{belum} orang</b>
          </p>

          <h6 className="mt-3 fw-bold">Rincian per Pepanthan:</h6>
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>No</th>
                <th>Pepanthan</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {rincian.length > 0
                ? rincian.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.namaPepanthan}</td>
                      <td>{item.jumlah}</td>
                    </tr>
                  ))
                : <tr><td colSpan="3">Tidak ada data</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <NavbarComponent />
      <div className="container mt-5 mb-3">
        <h2 className="fw-bold text-center">📊 Statistik Jemaat</h2>
        <button
          className="btn btn-light btn-sm mb-3"
          style={{ backgroundColor: "#004d97", color: "white" }}
          onClick={() => navigate("/data")}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ color: "white" }} /> Kembali
        </button>

        {/* ===== Filter Tahun (Dropdown) ===== */}
        <div className="mb-3">
          <label className="fw-bold me-2">Filter Tahun:</label>
          {listTahun.length === 0 ? (
            <span>Memuat tahun...</span>
          ) : (
            <select
              className="form-select d-inline-block w-auto"
              value={tahunTerpilih}
              onChange={(e) => setTahunTerpilih(parseInt(e.target.value))}
            >
              {listTahun.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>


        <ul className="nav nav-tabs mt-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "data" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("data");
                localStorage.setItem("activeTabStatistik", "data");
              }}
            >
              📑 Data Statistik
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "visual" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("visual");
                localStorage.setItem("activeTabStatistik", "visual");
              }}
            >
              📈 Visual Statistik
            </button>
          </li>
        </ul>

        {activeTab === "data" && (
          <>
            {/* Total Jemaat */}
            <div className="card shadow-sm my-4">
              <div className="card-body">
                <h4 className="mb-3">
                  Total Jemaat: <span className="text-primary fw-bold">{totalJemaat}</span>
                </h4>

                <h5>
                  Total Jemaat yang masih hidup:{" "}
                  <span className="text-success fw-bold">
                    {totalJemaat - (meninggalData?.total || 0)}
                  </span>
                </h5>

                <h5>
                  Total Jemaat yang sudah meninggal:{" "}
                  <span className="text-danger fw-bold">
                    {meninggalData?.total || 0}
                  </span>
                </h5>
              </div>
            </div>

            <div className="row">
              {/* Jumlah Jemaat per Pepanthan */}
              <div className="col-md-6">
                <div className="card shadow-sm">
                  <div className="card-header text-white" style={{ backgroundColor: "#004d97" }}>
                    <h5 className="mb-0">Jumlah Jemaat per Pepanthan</h5>
                  </div>
                  <div className="card-body p-0">
                    <table className="table table-bordered mb-0 text-center">
                      <thead className="table-light">
                        <tr>
                          <th>No</th>
                          <th>Pepanthan</th>
                          <th>Jumlah Jemaat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pepanthanData.length === 0
                          ? <tr><td colSpan="3" className="py-3">Memuat data...</td></tr>
                          : pepanthanData.map((item, idx) => {
                              const meninggalPepanthan = meninggalData?.rincianPepanthan?.find(
                                m => m.namaPepanthan === item.name
                              )?.jumlah || 0;

                              const hidup = item.value - meninggalPepanthan;

                              return (
                                <tr key={idx}>
                                  <td>{idx + 1}</td>
                                  <td>{item.name}</td>
                                  <td>{hidup} orang</td>
                                </tr>
                              );
                            })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Jemaat Meninggal */}
              <div className="col-md-6">
                {renderMeninggalTable(meninggalData)}
              </div>
            </div>

            {/* Rincian Dewasa & Anak per Pepanthan */}
            <div className="card shadow-sm my-4">
              <div className="card-header text-white" style={{ backgroundColor: "#004d97" }}>
                <h5 className="mb-0">Rincian Jemaat Dewasa & Anak per Pepanthan</h5>
              </div>
              <div className="card-body p-0">
                <table className="table table-bordered mb-0 text-center">
                  <thead className="table-light">
                    <tr>
                      <th>No</th>
                      <th>Pepanthan</th>
                      <th>Dewasa</th>
                      <th>Anak (17 tahun kebawah)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pepanthanData.length === 0
                      ? <tr><td colSpan="4" className="py-3">Memuat data...</td></tr>
                      : pepanthanData.map((pepanthan, idx) => {
                          const dewasaAsli = pepanthan.rincian.filter(j => {
                            if (!j.tanggalLahir) return false;
                            const umur = Math.floor((new Date() - new Date(j.tanggalLahir)) / (1000*60*60*24*365.25));
                            return umur >= 17;
                          }).length;

                          const anakAsli = pepanthan.rincian.filter(j => {
                            if (!j.tanggalLahir) return false;
                            const umur = Math.floor((new Date() - new Date(j.tanggalLahir)) / (1000*60*60*24*365.25));
                            return umur < 17;
                          }).length;

                          const meninggalPepanthan = meninggalData?.rincianPepanthan?.find(
                            m => m.namaPepanthan === pepanthan.name
                          )?.jumlah || 0;

                          const totalAsli = dewasaAsli + anakAsli;
                          let dewasa = dewasaAsli;
                          let anak = anakAsli;

                          if (totalAsli > 0 && meninggalPepanthan > 0) {
                            const proporsiDewasa = dewasaAsli / totalAsli;
                            const proporsiAnak = anakAsli / totalAsli;

                            dewasa = Math.max(0, Math.round(dewasaAsli - meninggalPepanthan * proporsiDewasa));
                            anak = Math.max(0, Math.round(anakAsli - meninggalPepanthan * proporsiAnak));
                          }

                          return (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{pepanthan.name}</td>
                              <td>{dewasa} orang</td>
                              <td>{anak} orang</td>
                            </tr>
                          );
                        })
                    }
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Gerejawi */}
            <h3 className="fw-bold mt-5">📌 Rekapitulasi Status Gerejawi</h3>
            <div className="row">
              <div className="col-md-4">{renderStatusTable("Status Nikah", nikahData, "nikah")}</div>
              <div className="col-md-4">{renderStatusTable("Status Baptis", baptisData, "baptis")}</div>
              <div className="col-md-4">{renderStatusTable("Status Sidi", sidiData, "sidi")}</div>
            </div>
          </>
        )}

        {activeTab === "visual" && (
          <div className="mt-4">
            <h4 className="fw-bold mb-3 text-center">📊 Distribusi Jemaat</h4>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "80px",
                flexWrap: "wrap",
              }}
            >
              {/* Doughnut Chart */}
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "350px", height: "350px" }}>
                  <DoughnutChart pepanthanData={pepanthanData} />
                </div>
                <h6 className="fw-bold mt-3">Legend Pepanthan:</h6>
                {pepanthanData.length === 0
                  ? <p>Memuat data...</p>
                  : pepanthanData.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", justifyContent: "center" }}>
                        <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: item.color }} />
                        <span>{item.name}: {item.value} orang</span>
                      </div>
                    ))
                }
              </div>

              {/* Bar Chart */}
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "500px", height: "250px" }}>
                  <BarChart genderData={genderData} />
                </div>
                <h6 className="fw-bold mt-3">Legend Jenis Kelamin:</h6>
                {genderData.length === 0
                  ? <p>Memuat data...</p>
                  : genderData.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", justifyContent: "center" }}>
                        <div style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor: idx === 0 ? "#4e79a7" : "#f28e2c"
                        }} />
                        <span>{item.jenisKelamin}: {item.jumlah} orang</span>
                      </div>
                    ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default HalamanStatistik;
