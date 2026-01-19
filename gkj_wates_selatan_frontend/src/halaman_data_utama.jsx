import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { NavbarComponent } from './components/NavbarComponent';
  // import jwt from "jsonwebtoken";
  import { useNavigate } from "react-router-dom";
  import Footer from "./components/footer";

const API_BASE = import.meta.env.VITE_API_BASE_URL;


const TabelDataJemaat = () => {
  const navigate = useNavigate();  
  const [dataJemaat, setDataJemaat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(''); // input sementara
  const [search, setSearch] = useState(''); // filter diterapkan saat klik Cari
  const [sortKey, setSortKey] = useState('');       // untuk pilihan dropdown saat ini
  const [appliedSort, setAppliedSort] = useState(''); // untuk sort yang diterapkan
  const [customSort, setCustomSort] = useState({});


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

  fetch(`${API_BASE}/api/jemaat`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
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
  let filteredData = dataJemaat.filter(data => {
    return (
      data.namaLengkap.toLowerCase().includes(search.toLowerCase()) &&
      (appliedFilters.jenisKelamin === '' || data.jenisKelamin === appliedFilters.jenisKelamin) &&
      (appliedFilters.pepanthan === '' || data.namaPepanthan === appliedFilters.pepanthan) &&
      (appliedFilters.statusSidi === '' || (appliedFilters.statusSidi === 'Sidi' ? data.statusSidi === 'Sidi' : data.statusSidi !== 'Sidi')) &&
      (appliedFilters.statusBaptis === '' || (appliedFilters.statusBaptis === 'Baptis' ? data.statusBaptis === 'Baptis' : data.statusBaptis !== 'Baptis')) &&
      (appliedFilters.statusNikah === '' || (appliedFilters.statusNikah === 'Nikah' ? data.statusNikah === 'Nikah' : data.statusNikah !== 'Nikah'))
    );
  });

  

  if (appliedSort === 'custom') {
  filteredData.sort((a, b) => {
    // Urutkan Nama Alfabet
    if (customSort.namaLengkap === 'asc') {
      return a.namaLengkap.localeCompare(b.namaLengkap);
    } else if (customSort.namaLengkap === 'desc') {
      return b.namaLengkap.localeCompare(a.namaLengkap);
    }

    // Status Sidi
    if (customSort.statusSidi) {
      const order = [customSort.statusSidi, customSort.statusSidi === 'Sidi' ? 'Belum Sidi' : 'Sidi'];
      const aVal = a.statusSidi === 'Sidi' ? 'Sidi' : 'Belum Sidi';
      const bVal = b.statusSidi === 'Sidi' ? 'Sidi' : 'Belum Sidi';
      return order.indexOf(aVal) - order.indexOf(bVal);
    }

    // Jenis Kelamin
    if (customSort.jenisKelamin) {
      const order = [customSort.jenisKelamin, customSort.jenisKelamin === 'Laki-laki' ? 'Perempuan' : 'Laki-laki'];
      return order.indexOf(a.jenisKelamin) - order.indexOf(b.jenisKelamin);
    }

  if (customSort.pepanthan) {
    const aIndex = a.namaPepanthan === customSort.pepanthan ? 0 : 1;
    const bIndex = b.namaPepanthan === customSort.pepanthan ? 0 : 1;
    return aIndex - bIndex;
  }


    // Status Pelayanan
    if (customSort.namaPelayanan) {
      const order = [customSort.namaPelayanan];
      return order.indexOf(a.namaPelayanan ?? 'Jemaat') - order.indexOf(b.namaPelayanan ?? 'Jemaat');
    }

    return 0;
  });
}






  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // ===== PAGINATION SLIDING =====
const maxVisiblePages = 5;
const half = Math.floor(maxVisiblePages / 2);

let startPage = Math.max(currentPage - half, 1);
let endPage = startPage + maxVisiblePages - 1;

if (endPage > totalPages) {
  endPage = totalPages;
  startPage = Math.max(endPage - maxVisiblePages + 1, 1);
}


  return (
    <div className="container-fluid mt-4 mb-3 px-5">
      <h3 className="text-center">Data Utama</h3>

      <div className="d-flex justify-content-end mb-3" style={{ gap: '10px', flexWrap: 'wrap' }}>
        {/* Search Input */}
        <div className="input-group" style={{ maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Cari jemaat..."
            aria-label="Cari jemaat"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setSearch(searchInput);
              setAppliedFilters(filters); // kalau pakai filter
              setCurrentPage(1);          // reset ke halaman 1
            }}
          >
            Cari
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setSearchInput('');
              setSearch('');
              setFilters({
                jenisKelamin: '',
                pepanthan: '',
                statusSidi: '',
                statusBaptis: '',
                statusNikah: '',
              });
              setAppliedFilters({
                jenisKelamin: '',
                pepanthan: '',
                statusSidi: '',
                statusBaptis: '',
                statusNikah: '',
              });
              setSortKey('');
              setAppliedSort('');
            }}
          >
            Bersihkan
          </button>
        </div>


        {/* Dropdown Filter + Sort */}
        {/* === Bagian Filter + Sort Dropdown === */}
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter & Sort
          </button>
          <ul className="dropdown-menu p-3" style={{ minWidth: '300px', maxHeight: '500px', overflowY: 'auto' }}>
            {/* === FILTER === */}
            <div className="mb-2">
              <strong>Jenis Kelamin</strong>
              <select
                className="form-select"
                value={filters.jenisKelamin}
                onChange={e => setFilters({...filters, jenisKelamin: e.target.value})}
              >
                <option value=''>Semua</option>
                <option value='Laki-laki'>Laki-laki</option>
                <option value='Perempuan'>Perempuan</option>
              </select>
            </div>

            <div className="mb-2">
              <strong>Pepanthan</strong>
              <select
                className="form-select"
                value={filters.pepanthan}
                onChange={e => setFilters({...filters, pepanthan: e.target.value})}
              >
                <option value=''>Semua</option>
                <option value='Induk Depok Kelompok 1'>Induk Depok Kelompok 1</option>
                <option value='Induk Depok Kelompok 2'>Induk Depok Kelompok 2</option>
                <option value='Induk Depok Kelompok 3'>Induk Depok Kelompok 3</option>
                <option value='Triharjo'>Triharjo</option>
                <option value='Wonogiri'>Wonogiri</option>
                <option value='Galur'>Galur</option>
              </select>
            </div>

            <div className="mb-2">
              <strong>Status Sidi</strong>
              <select
                className="form-select"
                value={filters.statusSidi}
                onChange={e => setFilters({...filters, statusSidi: e.target.value})}
              >
                <option value=''>Semua</option>
                <option value='Sidi'>Sidi</option>
                <option value='Belum Sidi'>Belum Sidi</option>
              </select>
            </div>

            <div className="mb-2">
              <strong>Status Baptis</strong>
              <select
                className="form-select"
                value={filters.statusBaptis}
                onChange={e => setFilters({...filters, statusBaptis: e.target.value})}
              >
                <option value=''>Semua</option>
                <option value='Baptis'>Baptis</option>
                <option value='Belum Baptis'>Belum Baptis</option>
              </select>
            </div>

            <div className="mb-2">
              <strong>Status Pernikahan</strong>
              <select
                className="form-select"
                value={filters.statusNikah}
                onChange={e => setFilters({...filters, statusNikah: e.target.value})}
              >
                <option value=''>Semua</option>
                <option value='Nikah'>Nikah</option>
                <option value='Belum Nikah'>Belum Nikah</option>
              </select>
            </div>

            {/* === SORT CUSTOM (Accordion) === */}
            <hr />
            <strong>Sort By Kustom</strong>

            {/* Sort Alfabet */}
            <div className="mb-2">
              <strong>Urutkan Nama</strong>
              <select
                className="form-select"
                value={customSort.namaLengkap || ''}
                onChange={e => setCustomSort({...customSort, namaLengkap: e.target.value})}
              >
                <option value="">-- Pilih Urutan --</option>
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </div>

            <div className="mb-2">
              <strong>Status Sidi</strong>
              <select
                className="form-select"
                value={customSort.statusSidi || ''}
                onChange={e => setCustomSort({...customSort, statusSidi: e.target.value})}
              >
                <option value="">-- Pilih Urutan --</option>
                <option value="Sidi">Sidi</option>
                <option value="Belum Sidi">Belum Sidi</option>
              </select>
            </div>

            <div className="mb-2">
              <strong>Jenis Kelamin</strong>
              <select
                className="form-select"
                value={customSort.jenisKelamin || ''}
                onChange={e => setCustomSort({...customSort, jenisKelamin: e.target.value})}
              >
                <option value="">-- Pilih Urutan --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div className="mb-2">
              <strong>Pepanthan</strong>
              <select
                className="form-select"
                value={customSort.pepanthan || ''}
                onChange={e => setCustomSort({...customSort, pepanthan: e.target.value})}
              >
                <option value="">-- Pilih Urutan --</option>
                <option value='Induk Depok Kelompok 1'>Induk Depok Kelompok 1</option>
                <option value='Induk Depok Kelompok 2'>Induk Depok Kelompok 2</option>
                <option value='Induk Depok Kelompok 3'>Induk Depok Kelompok 3</option>
                <option value='Triharjo'>Triharjo</option>
                <option value='Wonogiri'>Wonogiri</option>
                <option value='Galur'>Galur</option>
              </select>
            </div>

            <div className="mb-2">
              <strong>Status Pelayanan</strong>
              <select
                className="form-select"
                value={customSort.namaPelayanan || ''}
                onChange={e => setCustomSort({...customSort, namaPelayanan: e.target.value})}
              >
                <option value="">-- Pilih Urutan --</option>
                <option value="Jemaat">Jemaat</option>
                <option value="Meninggal">Meninggal</option>
                <option value="Pendeta">Pendeta</option>
                <option value="Majelis">Majelis</option>
              </select>
            </div>



            {/* === Tombol Terapkan & Reset === */}
            <div className="d-flex justify-content-between mt-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setAppliedFilters(filters);
                  setAppliedSort('custom'); // tandai pakai custom sort
                  setSearch(searchInput);
                  setCurrentPage(1);
                }}
              >
                Terapkan
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  setFilters({
                    jenisKelamin: '',
                    pepanthan: '',
                    statusSidi: '',
                    statusBaptis: '',
                    statusNikah: '',
                  });
                  setAppliedFilters({
                    jenisKelamin: '',
                    pepanthan: '',
                    statusSidi: '',
                    statusBaptis: '',
                    statusNikah: '',
                  });
                  setSearch('');
                  setSearchInput('');
                  setCustomSort({});
                  setAppliedSort('');
                  setCurrentPage(1);
                }}
              >
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
                  <th>Status Baptis</th>
                  <th>Status Sidi</th>
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
                      <td className='text-center'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{data.namaLengkap}</td>
                      <td>
                        {data.tempatLahir || '-'}, {formatTanggal(data.tanggalLahir)}
                      </td>
                      <td className="text-center">{data.jenisKelamin || '-'}</td>
                      <td className="text-center">{data.namaPepanthan || '-'}</td>
                      <td className="text-center">{data.statusBaptis || 'Belum Diketahui'}</td>
                      <td className="text-center">{data.statusSidi || 'Belum Diketahui'}</td>
                      <td className="text-center">{data.statusNikah || 'Belum Diketahui'}</td>
                      <td className="text-center">{data.namaPelayanan ?? 'Belum Diketahui'}</td>

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
          {/* Numbered pages (Sliding) */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(page)}
              >
                {page}
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
      <Footer />
    </div>
  );
};


export default HalamanData;
