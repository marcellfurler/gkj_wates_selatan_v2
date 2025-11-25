import React, { useEffect, useState } from "react";
import { NavbarComponent } from "./components/NavbarComponent";

const HalamanStatistik = () => {
  const [totalJemaat, setTotalJemaat] = useState(0);
  const [pepanthanData, setPepanthanData] = useState([]);

  useEffect(() => {
    fetchTotalJemaat();
    fetchPepanthanData();
  }, []);

  // =========================
  // GET TOTAL JEMAAT
  // =========================
  const fetchTotalJemaat = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/statistik/total");
      const data = await res.json();
      setTotalJemaat(data.total);
    } catch (err) {
      console.error("Error fetching total jemaat:", err);
    }
  };

  // =========================
  // GET JEMAAT PER PEPANTHAN
  // =========================
  const fetchPepanthanData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/statistik/pepanthan");
      const data = await res.json();
      setPepanthanData(data.data);
    } catch (err) {
      console.error("Error fetching pepanthan data:", err);
    }
  };

  return (
    <>
      <NavbarComponent />

      <div className="container mt-5">
        <h2 className="fw-bold">📊 Statistik Jemaat</h2>
        <p className="text-muted">Laporan statistik jemaat berdasarkan database terbaru.</p>

        {/* TOTAL JEMAAT */}
        <div className="card shadow-sm my-4">
          <div className="card-body">
            <h4 className="mb-0">
              Total Jemaat: <span className="text-primary fw-bold">{totalJemaat}</span>
            </h4>
          </div>
        </div>

        {/* TABEL PER PEPANTHAN */}
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
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

      </div>
    </>
  );
};

export default HalamanStatistik;
