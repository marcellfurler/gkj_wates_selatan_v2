import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from './components/NavbarComponent';
import logoGKJ from './assets/logoGKJ.png';

const TabelDataJemaat = () => {
  const [dataJemaat, setDataJemaat] = useState([]); // 🔹 ubah: pakai state
  const [loading, setLoading] = useState(true);

  // 🔹 ambil data dari backend
  useEffect(() => {
    fetch("http://localhost:5000/api/jemaat")
      .then((res) => res.json())
      .then((data) => {
        setDataJemaat(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Gagal mengambil data jemaat:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-5">⏳ Memuat data jemaat...</p>;
  }
  const ComponentNavigasi = ({ kodeJemaat_yang_dikirim }) => {
    const navigate = useNavigate();

    const handleDetailClick = () => {
        const kodeJemaat = kodeJemaat_yang_dikirim; // Misalkan ini NIK = 213

        // ✅ CARA BENAR: Navigasi dengan Query Parameter
        navigate(`/detailPendeta?kodeJemaat=${kodeJemaat}`); 
        
        // Console log yang Anda lihat:
        console.log("Pengiriman kodeJemaat:", kodeJemaat);
    };

    return (
        <button onClick={handleDetailClick}>Lihat Detail</button>
    );
};

  return (
    <div className="container-fluid mt-5 mb-5 px-4">
      <div className="card border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-sm table-hover mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th>No</th>
                  <th>Nama Jemaat</th>
                  <th>Tempat, Tanggal Lahir</th>
                  <th>Jenis Kelamin</th>
                  <th>Pepanthan</th>
                  <th>Status Sidi</th>
                  <th>Status Baptis</th>
                  <th>Status Pernikahan</th>
                  <th>Status Pelayanan</th>
                  <th>Inf. Lengkap</th>
                </tr>
              </thead>
              <tbody>
                {dataJemaat.map((data, index) => (
                  <tr key={index} style={{ fontSize: '0.9rem' }}>
                    <td>{index + 1}</td>
                    <td>{data.namaLengkap}</td>
                    <td>
                      {data.tempatLahir}, {new Date(data.tanggalLahir).toLocaleDateString("id-ID")}
                    </td>

                    <td>
                      {data.jenisKelamin || '-'}
                    </td>

                    <td>{data.namaPepanthan || '-'}</td>

                    <td>
                      {data.statusSidi === 'Sidi' ? 'Sidi' : 'Belum Sidi'}
                    </td>


                    <td>
                      {data.statusBaptis === 'Baptis' ? 'Baptis' : 'Belum Baptis'}
                    </td>

                    <td>
                      {data.statusNikah === 'Nikah' ? 'Nikah' : 'Belum Nikah'}
                    </td>


                    <td>
                      {data.namaPelayanan === 'Pendeta' ? (
                        <Link
                          // ✅ PERBAIKAN: Gunakan template literal untuk menambahkan ?nik=
                          to={`/detailPendeta?kodeJemaat=${data.kodeJemaat}`} 
                          // Hapus attribute 'state' karena kita menggunakan Query Parameter
                          // state={{ nik: data.NIK, namaLengkap: data.namaLengkap }} 
                          className="text-primary" 
                          onClick={() => console.log("🔗 Mengirim kodeJemaat (Query Param):", data.kodeJemaat)}
                        >
                          {data.namaPelayanan} 
                        </Link>
                      ) : (
                        // ...
                        <span>{data.namaPelayanan || 'Jemaat'}</span>
                      )}
                    </td>

                    <td>
                      <Link
                        to="/detail"
                        state={{ data }}
                        className="text-primary"
                        title="Lihat Detail"
                      >
                        detail
                      </Link>
                    </td>

                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const HalamanData = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <NavbarComponent />
      <TabelDataJemaat />
    </div>
  );
};

export default HalamanData;