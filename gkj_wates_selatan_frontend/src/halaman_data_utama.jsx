import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { NavbarComponent } from './components/NavbarComponent';
  // import jwt from "jsonwebtoken";
  import { useNavigate } from "react-router-dom";


const TabelDataJemaat = () => {
  const navigate = useNavigate();  
  const [dataJemaat, setDataJemaat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(''); // input sementara
  const [search, setSearch] = useState(''); // filter diterapkan saat klik Cari
  const [filters, setFilters] = useState({
    jenisKelamin: '',
    pepanthan: '',
    statusSidi: '',
    statusBaptis: '',
    statusNikah: '',
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;





 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  fetch("http://localhost:5000/api/jemaat", {
    headers: { "Authorization": `Bearer ${token}` }
  })
  .then(async res => {
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      // baca teks dulu supaya bisa log error
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.json();
  })
  .then(data => {
    setDataJemaat(data);
    setLoading(false);
  })
  .catch(err => {
    console.error("❌ Gagal mengambil data jemaat:", err);
    setLoading(false);
  });
}, [navigate]);
 


  if (loading) return <p className="text-center mt-5">⏳ Memuat data jemaat...</p>;

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleApplySearch = () => {
    setSearch(searchInput);
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    setSearchInput('');
    setSearch('');
    const resetFilters = {
      jenisKelamin: '',
      pepanthan: '',
      statusSidi: '',
      statusBaptis: '',
      statusNikah: '',
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(tanggal).toLocaleDateString('id-ID', options);
  };



  // Filter data sesuai search + filters yang diterapkan
  const filteredData = dataJemaat.filter(data => {
    return (
      data.namaLengkap.toLowerCase().includes(search.toLowerCase()) &&
      (appliedFilters.jenisKelamin === '' || data.jenisKelamin === appliedFilters.jenisKelamin) &&
      (appliedFilters.pepanthan === '' || data.namaPepanthan === appliedFilters.pepanthan) &&
      (appliedFilters.statusSidi === '' || (appliedFilters.statusSidi === 'Sidi' ? data.statusSidi === 'Sidi' : data.statusSidi !== 'Sidi')) &&
      (appliedFilters.statusBaptis === '' || (appliedFilters.statusBaptis === 'Baptis' ? data.statusBaptis === 'Baptis' : data.statusBaptis !== 'Baptis')) &&
      (appliedFilters.statusNikah === '' || (appliedFilters.statusNikah === 'Nikah' ? data.statusNikah === 'Nikah' : data.statusNikah !== 'Nikah'))
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="container-fluid mt-4 mb-3 px-5">
      <h3 className="text-center">Data Utama</h3>

      {/* Search + Filter */}
      <div className="d-flex justify-content-end mb-3">
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Cari jemaat..."
            aria-label="Cari jemaat"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="button" className="btn btn-outline-secondary" onClick={handleApplySearch}>
            Cari
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="visually-hidden">Toggle Dropdown</span>
          </button>
          <ul className="dropdown-menu p-3" style={{ minWidth: '250px' }}>
            <div className="mb-2">
              <strong>Jenis Kelamin</strong>
              <select className="form-select" value={filters.jenisKelamin} onChange={e => handleFilterChange('jenisKelamin', e.target.value)}>
                <option value=''>Semua</option>
                <option value='Laki-laki'>Laki-laki</option>
                <option value='Perempuan'>Perempuan</option>
              </select>
            </div>
            <div className="mb-2">
              <strong>Pepanthan</strong>
              <select className="form-select" value={filters.pepanthan} onChange={e => handleFilterChange('pepanthan', e.target.value)}>
                <option value=''>Semua</option>
                <option value='Induk Depok'>Induk Depok</option>
                <option value='Triharjo'>Triharjo</option>
                <option value='Wonogiri'>Wonogiri</option>
                <option value='Galur'>Galur</option>
              </select>
            </div>
            <div className="mb-2">
              <strong>Status Sidi</strong>
              <select className="form-select" value={filters.statusSidi} onChange={e => handleFilterChange('statusSidi', e.target.value)}>
                <option value=''>Semua</option>
                <option value='Sidi'>Sidi</option>
                <option value='Belum Sidi'>Belum Sidi</option>
              </select>
            </div>
            <div className="mb-2">
              <strong>Status Baptis</strong>
              <select className="form-select" value={filters.statusBaptis} onChange={e => handleFilterChange('statusBaptis', e.target.value)}>
                <option value=''>Semua</option>
                <option value='Baptis'>Baptis</option>
                <option value='Belum Baptis'>Belum Baptis</option>
              </select>
            </div>
            <div className="mb-2">
              <strong>Status Pernikahan</strong>
              <select className="form-select" value={filters.statusNikah} onChange={e => handleFilterChange('statusNikah', e.target.value)}>
                <option value=''>Semua</option>
                <option value='Nikah'>Nikah</option>
                <option value='Belum Nikah'>Belum Nikah</option>
              </select>
            </div>
            <div className="d-grid mt-2">
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleReset}>
                Reset Semua
              </button>
            </div>
          </ul>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="card border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              className="table table-primary table-striped-columns table-sm table-hover mb-1"
              style={{ 
                borderCollapse: 'separate',
                borderSpacing: '0 6px'   // ⬅️ jarak antar baris
              }}
            >
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr className="text-center">
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
                {currentData.length > 0 ? (
                  currentData.map((data, index) => (
                    <tr
                      key={index}
                      className="align-middle"
                      style={{ fontSize: '0.9rem', backgroundColor: '#fff', borderRadius: '6px' }}
                    >
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{data.namaLengkap}</td>
                      <td>
                        {data.tempatLahir || '-'}, {formatTanggal(data.tanggalLahir)}
                      </td>
                      <td className="text-center">{data.jenisKelamin || '-'}</td>
                      <td className="text-center">{data.namaPepanthan || '-'}</td>
                      <td className="text-center">{data.statusSidi === 'Sidi' ? 'Sidi' : 'Belum Sidi'}</td>
                      <td className="text-center">{data.statusBaptis === 'Baptis' ? 'Baptis' : 'Belum Baptis'}</td>
                      <td className="text-center">{data.statusNikah === 'Nikah' ? 'Nikah' : 'Belum Nikah'}</td>
                      <td className="text-center">{data.namaPelayanan ?? 'Jemaat'}</td>

                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => navigate("/detail", { state: { data } })}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center align-middle">Data tidak ditemukan</td>
                  </tr>
                )}
              </tbody>


            </table>
          </div>
        </div>
      </div>
      {/* Pagination Bootstrap */}
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-end mt-3">

          {/* Previous */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
          </li>

          {/* Numbered pages */}
          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}

          {/* Next */}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </li>

        </ul>
      </nav>

    </div>
  );
};

const HalamanData = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // jika tidak ada token, direkt ke halaman login
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <NavbarComponent />
      <TabelDataJemaat />
    </div>
  );
};


export default HalamanData;
