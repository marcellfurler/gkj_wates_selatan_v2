import React, { useEffect, useState } from "react";
import { NavbarComponent } from "./components/NavbarComponent";

const HalamanDemografi = () => {
  const [pepanthanList, setPepanthanList] = useState([]);
  const [selectedPepanthan, setSelectedPepanthan] = useState(null);

  useEffect(() => {
    fetchPepanthan();
  }, []);

  // AMBIL DATA JEMAAT PER PEPANTHAN
  const fetchPepanthan = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/statistik/pepanthan");
      const data = await res.json();
      setPepanthanList(data.data);
    } catch (err) {
      console.error("Error fetching pepanthan:", err);
    }
  };

  // MAPS KOORDINAT (bisa kamu edit)
  const mapsLocation = {
    "DEPOK": "https://maps.app.goo.gl/Zck16h7pKKjPG5Xz8",
    "WONOGIRI": "https://www.google.com/maps?q=Wonogiri",
    "GALUR": "https://www.google.com/maps?q=Galur+Kulon+Progo",
    "TRIHIHARJO": "https://www.google.com/maps?q=Triharjo+Kulon+Progo"
  };

  return (
    <>
      <NavbarComponent />

      <div className="container mt-4 mb-5">
        <h2 className="fw-bold">🗺️ Demografi Pepanthan</h2>
        <p className="text-muted">Informasi lokasi dan statistik singkat setiap pepanthan.</p>

        <div className="row mt-4">
          {pepanthanList.map((item, idx) => (
            <div key={idx} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold">
                    {item.namaPepanthan || "Tidak diketahui"}
                  </h5>

                  <p className="card-text text-muted">
                    Jumlah Jemaat: <span className="fw-bold">{item.jumlah}</span>
                  </p>

                  <div className="d-flex gap-2">
                    {/* LINK GOOGLE MAPS */}
                    <a
                      href={mapsLocation[item.namaPepanthan] || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      📍 Lihat Lokasi
                    </a>

                    {/* POPUP STATISTIK */}
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => setSelectedPepanthan(item)}
                    >
                      📊 Statistik
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* POPUP MODAL */}
        {selectedPepanthan && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    Statistik {selectedPepanthan.namaPepanthan}
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setSelectedPepanthan(null)}
                  ></button>
                </div>

                <div className="modal-body">
                  <p className="mb-1"><strong>Pepanthan:</strong> {selectedPepanthan.namaPepanthan}</p>
                  <p><strong>Jumlah Jemaat:</strong> {selectedPepanthan.jumlah}</p>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedPepanthan(null)}
                  >
                    Tutup
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HalamanDemografi;
