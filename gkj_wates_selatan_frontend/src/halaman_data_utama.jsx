import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { NavbarComponent } from './components/NavbarComponent';

const TabelDataJemaat = () => {
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

  useEffect(() => {
    fetch("http://localhost:5000/api/jemaat")
      .then(res => res.json())
      .then(data => {
        setDataJemaat(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Gagal mengambil data jemaat:", err);
        setLoading(false);
      });
  }, []);

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

  return (
    <div className="container-fluid mt-5 mb-5 px-5">
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
              className="table table-primary table-striped table-sm table-hover mb-1"
              style={{ borderCollapse: 'separate', borderSpacing: '0 5px' }}
            >
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
                {filteredData.length > 0 ? (
                  filteredData.map((data, index) => (
                    <tr key={index} style={{ fontSize: '0.9rem', backgroundColor: '#fff', borderRadius: '6px' }}>
                      <td>{index + 1}</td>
                      <td>{data.namaLengkap}</td>
                      <td>{data.tempatLahir}, {data.tanggalLahir ? new Date(data.tanggalLahir).toLocaleDateString("id-ID") : '-'}</td>
                      <td>{data.jenisKelamin || '-'}</td>
                      <td>{data.namaPepanthan || '-'}</td>
                      <td>{data.statusSidi === 'Sidi' ? 'Sidi' : 'Belum Sidi'}</td>
                      <td>{data.statusBaptis === 'Baptis' ? 'Baptis' : 'Belum Baptis'}</td>
                      <td>{data.statusNikah === 'Nikah' ? 'Nikah' : 'Belum Nikah'}</td>
                      <td>{data.namaPelayanan ?? 'Jemaat'}</td>
                      <td>
                        <Link to="/detail" state={{ data }} className="text-primary" title="Lihat Detail">
                          detail
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">Data tidak ditemukan</td>
                  </tr>
                )}
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
