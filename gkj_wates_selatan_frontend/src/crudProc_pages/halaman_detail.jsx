import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../components/NavbarComponent';
import axios from 'axios';

// -----------------------------
// 🌟 DETAIL ITEM COMPONENT
// -----------------------------
const DetailListItem = ({ label, value }) => (
  <li className="list-group-item d-flex align-items-start py-2 px-3 border-0 border-bottom">
    <div className="fw-semibold text-muted" style={{ width: '150px', minWidth: '150px' }}>
      {label}
    </div>
    <div className="text-dark flex-grow-1 ps-2">
      {Array.isArray(value) ? (
        value.map((v, i) => <div key={i}>{v}</div>)
      ) : (
        <div>{value}</div>
      )}
    </div>
  </li>
);

// Format tanggal
const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(tanggal).toLocaleDateString('id-ID', options);
};

// -----------------------------
// 🌟 DETAIL PAGE COMPONENT
// -----------------------------
const DetailJemaat = ({ data }) => {
  const navigate = useNavigate();

  const dataPribadi = [
    { label: 'Nama Lengkap', value: data.namaLengkap || '-' },
    { label: 'TTL', value: `${data.tempatLahir || '-'}, ${formatTanggal(data.tanggalLahir)}` },
    { label: 'Jenis Kelamin', value: data.jenisKelamin || '-' },
    { label: 'Agama', value: data.agama || '-' },
    { label: 'Golongan Darah', value: data.golonganDarah || '-' },
    { label: 'Warga Negara', value: data.wargaNegara || '-' },
    { label: 'Alamat', value: data.alamat || '-' },
    { label: 'Nama Pekerjaan', value: data.namaPekerjaan || '-' },
    { label: 'Jabatan', value: data.jabatan || '-' }
  ];

  const dataKontak = [
    { label: 'No. Telepon', value: data.nomorTelepon || '-' },
    { label: 'Alamat', value: data.alamat || '-' },
  ];

  // Status Gerejawi dengan rincian sejajar
  const dataGerejawi = [
    {
      label: 'Baptis',
      value: data.statusBaptis && data.statusBaptis !== '-' 
        ? [data.statusBaptis, `${data.tempatBaptis || '-'}, ${formatTanggal(data.tanggalBaptis)}`]
        : ['Belum Baptis', ''],
    },
    {
      label: 'Sidi',
      value: data.statusSidi && data.statusSidi !== '-' 
        ? [data.statusSidi, `${data.tempatSidi || '-'}, ${formatTanggal(data.tanggalSidi)}`]
        : ['Belum Sidi', ''],
    },
    {
      label: 'Nikah',
      value: data.statusNikah && data.statusNikah !== '-' 
        ? [
            data.statusNikah,
            `${data.tempatNikah || '-'}, ${formatTanggal(data.tanggalNikah)}`,
            data.namaPasangan ? `Nama Pasangan: ${data.namaPasangan} (${data.gerejaAsal || '-'})` : ''
          ]
        : ['Belum Nikah', ''],
    },
    { label: 'Pelayanan', value: data.namaPelayanan || '-' },
    { label: 'Pepanthan', value: data.namaPepanthan || '-' },
  ];


  const handleHapus = async (kodeJemaat) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus jemaat ini?")) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/jemaat/hapus/${kodeJemaat}`);
      alert(response.data.message);
      navigate("/data"); // kembali ke daftar jemaat
    } catch (error) {
      console.error("Error hapus jemaat:", error);
      alert("Gagal menghapus jemaat!");
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-sm border-0 overflow-hidden">

        {/* HEADER CARD */}
        <div
          className="card-header text-white d-flex align-items-center justify-content-center position-relative"
          style={{
            backgroundColor: '#004d97',
            borderBottom: 'none',
            height: '60px',
            padding: '0 1rem',
          }}
        >
          <Link
            to="/data"
            className="btn btn-light btn-sm fw-bold position-absolute start-0 ms-3"
            style={{ color: "#004d97" }}
            title="Kembali"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Kembali
          </Link>

          <h5 className="mb-0 fw-bold text-center flex-grow-1">BIODATA JEMAAT</h5>

          <div className="position-absolute end-0 me-3 d-flex gap-2">
            <Link
              to="/edit"
              state={{ data }}
              className="btn btn-light btn-sm fw-bold" 
              style={{ color: "#004d97" }}
              title="Edit Data"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="me-1" /> Edit
            </Link>

            <button
              onClick={() => handleHapus(data.kodeJemaat)}
              className="btn btn-danger btn-sm fw-bold" 
              title="Hapus Data"
            >
              Hapus
            </button>
          </div>
        </div>

        {/* BODY CARD */}
        <div className="card-body p-0">
          <div className="row g-0">

            {/* FOTO */}
            <div className="col-12 col-lg-4 p-4 border-end d-flex flex-column align-items-center bg-light">
              <img
                src={data.foto ? `http://localhost:5000/${data.foto}` : "https://placehold.co/150x150/004d99/ffffff?text=FOTO"}
                alt="Foto Profil Jemaat"
                className="img-fluid rounded-circle shadow mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />

              <h5 className="fw-bold mb-1" style={{ color: "#004d97" }}>{data.namaLengkap || 'Nama Jemaat'}</h5>
              <p className="text-muted small mb-0" >{data.namaPelayanan || '-'}</p>
              <p className="text-muted small">Pepanthan: {data.namaPepanthan || '-'}</p>
            </div>

            {/* DATA DETAIL */}
            <div className="col-12 col-lg-8">
              <ul className="list-group list-group-flush">
                <li className="list-group-item bg-light fw-bold py-2 border-top-0">Data Pribadi</li>
                {dataPribadi.map((item, index) => (
                  <DetailListItem key={`pribadi-${index}`} label={item.label} value={item.value} />
                ))}

                <li className="list-group-item bg-light fw-bold py-2">Kontak & Alamat</li>
                {dataKontak.map((item, index) => (
                  <DetailListItem key={`kontak-${index}`} label={item.label} value={item.value} />
                ))}

                <li className="list-group-item bg-light fw-bold py-2">Status Gerejawi</li>
                {dataGerejawi.map((item, index) => (
                  <DetailListItem key={`gereja-${index}`} label={item.label} value={item.value} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------
// 🌟 MAIN PAGE
// -----------------------------
const HalamanDetail = () => {
  const location = useLocation();
  const data = location.state?.data;

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#e2e2e2' }}>
        <NavbarComponent />
        <div className="container mt-5 text-center">
          <h4>Data jemaat tidak ditemukan atau gagal dimuat dari halaman sebelumnya.</h4>
          <Link to="/data" className="btn btn-outline-secondary mt-3">
            &larr; Kembali ke Daftar Jemaat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <NavbarComponent />
      <DetailJemaat data={data} />
    </div>
  );
};

export default HalamanDetail;
