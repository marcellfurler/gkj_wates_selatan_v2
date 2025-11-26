import React, { useEffect, useState } from "react";
import { NavbarComponent } from "./components/NavbarComponent";
import DoughnutChart from "./components/charts/doughnut";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import { faArrowLeft, faSave, faArrowRight, faImage } from "@fortawesome/free-solid-svg-icons";


const HalamanStatistik = () => {
    const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("data"); // ⭐ TAB STATE

  const [totalJemaat, setTotalJemaat] = useState(0);
  const [pepanthanData, setPepanthanData] = useState([]);

  // Status Gerejawi
  const [nikahData, setNikahData] = useState(null);
  const [baptisData, setBaptisData] = useState(null);
  const [sidiData, setSidiData] = useState(null);

    useEffect(() => {
    const savedTab = localStorage.getItem("activeTabStatistik");
    if (savedTab) {
        setActiveTab(savedTab);
    }
    }, []);

    // 🔵 2. Fetch semua data
    useEffect(() => {
    fetchTotalJemaat();
    fetchPepanthanData();
    fetchNikahData();
    fetchBaptisData();
    fetchSidiData();
    }, []);

  // =========================
  // BACKEND FETCH
  // =========================
  const fetchTotalJemaat = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/statistik/total");
      const data = await res.json();
      setTotalJemaat(data.total || 0);
    } catch (err) {
      console.error("Error fetching total jemaat:", err);
    }
  };

  const fetchPepanthanData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/statistik/pepanthan");
      const data = await res.json();
      setPepanthanData(data || []);
    } catch (err) {
      console.error("Error fetching pepanthan data:", err);
    }
  };

  const fetchNikahData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/statistik/nikah");
      const data = await res.json();
      setNikahData(data);
    } catch (err) {
      console.error("Error fetching nikah data:", err);
    }
  };

  const fetchBaptisData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/statistik/baptis");
      const data = await res.json();
      setBaptisData(data);
    } catch (err) {
      console.error("Error fetching baptis data:", err);
    }
  };

  const fetchSidiData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/statistik/sidi");
      const data = await res.json();
      setSidiData(data);
    } catch (err) {
      console.error("Error fetching sidi data:", err);
    }
  };

  // =========================
  // RENDER SUB TABEL STATUS
  // =========================
  const renderStatusTable = (title, data, type) => {
    if (!data) {
      return (
        <div className="card shadow-sm my-4">
          <div className="card-body text-center">Memuat data...</div>
        </div>
      );
    }

    const sudah = type === "nikah" ? data.nikah : data.sudah;
    // const belum = type === "nikah" ? data.belumNikah : data.belum;
    const rincian = data.rincianPepanthan || [];

    return (
      <div className="card shadow-sm my-4">
         <div className="card-header text-white" style={{ backgroundColor: "#004d97" }}>
          <h5 className="mb-0">{title}</h5>
        </div>
        <div className="card-body">
          <p>
            Informasi Jemaat yang sudah {type === "nikah" ? "Nikah" : type === "baptis" ? "Baptis" : "Sidi"}: 
            <b> {sudah} orang</b>
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
              {rincian.length > 0 ? (
                rincian.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.namaPepanthan}</td>
                    <td>{item.jumlah}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <NavbarComponent />
      <div className="container mt-5 mb-3 ">
        


        <h2 className="fw-bold text-center">📊 Statistik Jemaat</h2>           
        <button
            className="btn btn-light btn-sm"
            style={{ backgroundColor: "#004d97", color: "white" }}
            onClick={() => navigate("/data")}
        >
            <FontAwesomeIcon icon={faArrowLeft} style={{ color: "white" }} /> Kembali
        </button>


        {/* ============ NAV TABS ============ */}
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

        {/* ===================== TAB CONTENT ===================== */}

        {activeTab === "data" && (
          <>
            {/* TOTAL JEMAAT */}
            <div className="card shadow-sm my-4">
              <div className="card-body">
                <h4 className="mb-0">
                  Total Jemaat:{" "}
                  <span className="text-primary fw-bold">{totalJemaat}</span>
                </h4>
              </div>
            </div>

            {/* TABEL PEPANTHAN */}
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
                    {pepanthanData.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="py-3">Memuat data...</td>
                      </tr>
                    ) : (
                      pepanthanData.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item.namaPepanthan || "-"}</td>
                          <td className="fw-bold">{item.jumlah}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* REKAP STATUS */}
            <h3 className="fw-bold mt-5">📌 Rekapitulasi Status Gerejawi</h3>
                <div className="row">
                <div className="col-md-4">
                    {renderStatusTable("Status Nikah", nikahData, "nikah")}
                </div>
                <div className="col-md-4">
                    {renderStatusTable("Status Baptis", baptisData, "baptis")}
                </div>
                <div className="col-md-4">
                    {renderStatusTable("Status Sidi", sidiData, "sidi")}
                </div>
                </div>
          </>
        )}

        {/* ===================== VISUAL TAB ===================== */}
        {activeTab === "visual" && (
            <div className="mt-4">
                <h4 className="fw-bold mb-3 text-center">📊 Distribusi Jemaat per Pepanthan</h4>

                {/* Chart Donut */}
                <DoughnutChart pepanthanData={pepanthanData} />
            </div>
        )}

      </div>
    </>
  );
};

export default HalamanStatistik;
