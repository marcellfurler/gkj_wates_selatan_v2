import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from "react-router-dom"; // Tambah Link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClipboardList, faChurch, faFilePdf, faSpinner, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../components/NavbarComponent';

// Path foto default jika tidak ada foto
import logoGKJ from '../assets/logoGKJ.png'; 

// -----------------------------
// 🌟 DETAIL LIST ITEM COMPONENT
// Diambil dari HalamanDetail untuk konsistensi
// -----------------------------
const DetailListItem = ({ label, value, renderHtml = false }) => (
    <li className="list-group-item d-flex align-items-center py-2 px-3 border-0 border-bottom">
        <div className="fw-semibold text-muted" style={{ width: '150px', minWidth: '150px' }}>
            {label}
        </div>
        <div className="text-dark flex-grow-1 ps-2">
            : {renderHtml ? <span dangerouslySetInnerHTML={{ __html: value }} /> : value}
        </div>
    </li>
);

// -----------------------------
// 🌟 MAIN COMPONENT
// -----------------------------
const HalamanDetailPendeta = () => {
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); 
    const kodeJemaat = searchParams.get('kodeJemaat'); 
    
    const [pendetaData, setPendetaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = "http://localhost:5000/api/pendeta/detail"; 

    // Fungsi untuk mengambil data dari backend
    const fetchPendetaData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("📡 Fetching data Pendeta untuk kodeJemaat:", kodeJemaat);
            const response = await fetch(`${API_URL}/${kodeJemaat}`); 
            console.log("📊 Response status:", response.status);
            
            const data = await response.json();
            console.log("📥 Response dari backend:", data);

            if (response.ok) {
                setPendetaData(data);
            } else {
                setError(data.message || "Gagal memuat data Pendeta.");
                setPendetaData(null);
            }
        } catch (err) {
            console.error("❌ Error saat fetch:", err);
            setError("Terjadi kesalahan jaringan atau server.");
            setPendetaData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (kodeJemaat) {
            console.log("✅ kodeJemaat berhasil dibaca dari URL:", kodeJemaat);
            fetchPendetaData();
        } else {
            console.error("❌ kodeJemaat tidak ada di URL Search Params.");
            setError("kodeJemaat tidak ditemukan. Pastikan Anda mengakses halaman ini dengan ?kodeJemaat=xxx");
            setLoading(false);
        }
    }, [kodeJemaat]);

    // Helper untuk menampilkan Sertifikat/File
    const renderSertifikat = (path, name) => {
        if (!path) return `<span class="text-muted">N/A</span>`;
        
        const fileUrl = `http://localhost:5000/${path}`; 
        return (
            `<a href="${fileUrl}" target="_blank" rel="noopener noreferrer" class="text-primary text-decoration-underline">
                <i class="me-1 fas fa-file-pdf"></i> Lihat Dokumen (${name})
            </a>`
        );
    };

    // Helper untuk format tanggal
    const formatTanggal = (tanggal) => {
        if (!tanggal) return "-";
        const date = new Date(tanggal);
        // Cek validitas tanggal (terkadang DB mengembalikan 0000-00-00)
        if (isNaN(date.getTime())) return "-"; 
        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    // --- State Handler (Loading/Error) ---
    if (loading) {
        return (
            <>
                <NavbarComponent />
                <p className="text-center mt-5">
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" /> 
                    <br/>Memuat data...
                </p>
            </>
        );
    }
    
    if (error) {
        return (
            <>
                <NavbarComponent />
                <div className="container mt-5">
                    <div className="alert alert-danger text-center">
                        <h4>Error!</h4>
                        <p>{error}</p>
                        <button onClick={() => navigate('/data')} className="btn btn-secondary">
                            <FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Data Jemaat
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (!pendetaData) {
        return (
            <>
                <NavbarComponent />
                <p className="text-center mt-5">Data Pendeta tidak ditemukan.</p>
            </>
        );
    }

    // --- Data Mapping untuk DetailListItem ---
    const { 
        namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, 
        golonganDarah, nomorTelepon, alamat, foto, jabatanPendeta, sertifikatPendeta 
    } = pendetaData;

    const riwayatList = pendetaData.riwayatPendetaList || [];
    const fotoUrl = foto ? `http://localhost:5000/${foto}` : logoGKJ;

    const dataPribadi = [
        // { label: 'kodeJemaat', value: pendetaData.kodeJemaat || '-' },
        { label: 'Nama Lengkap', value: namaLengkap || '-' },
        { label: 'TTL', value: `${tempatLahir || '-'}, ${formatTanggal(tanggalLahir)}` },
        { label: 'Jenis Kelamin', value: jenisKelamin || '-' },
        { label: 'Agama', value: agama || '-' },
        { label: 'Gol. Darah', value: golonganDarah || '-' },
        { label: 'Alamat', value: alamat || '-' },
        { label: 'No. Telepon', value: nomorTelepon || '-' },
    ];

    const dataJabatan = [
        { label: 'Jabatan', value: jabatanPendeta || '-' },
        { label: 'Sertifikat', value: renderSertifikat(sertifikatPendeta, 'Tahbisan'), html: true },
    ];


    // --- JSX Render ---
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
            <NavbarComponent />
            <div className="container mt-4 mb-5">
                <div className="card shadow-sm border-0 overflow-hidden">

                    {/* HEADER CARD - Mengikuti gaya HalamanDetail */}
                    <div
                        className="card-header text-white d-flex align-items-center justify-content-center position-relative"
                        style={{
                            backgroundColor: '#004d97',
                            borderBottom: 'none',
                            height: '60px',
                            padding: '0 1rem',
                        }}
                    >
                        {/* Tombol Kembali di kiri */}
                        <Link
                            to="/data"
                            className="btn btn-light btn-sm fw-bold position-absolute start-0 ms-3"
                            style={{ color: "#004d97" }}
                            title="Kembali"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Kembali
                        </Link>

                        {/* Judul Tengah */}
                        <h5 className="mb-0 fw-bold text-center flex-grow-1">DETAIL DATA PENDETA</h5>

                        {/* Tombol Kosong (atau Edit/Hapus jika ada) */}
                        <div style={{ width: '130px' }}></div> 
                    </div>

                    {/* BODY CARD */}
                    <div className="card-body p-0">
                        <div className="row g-0">

                            {/* FOTO & STATUS UTAMA */}
                            <div className="col-12 col-lg-4 p-4 border-end d-flex flex-column align-items-center bg-light">
                                <img
                                    src={fotoUrl}
                                    alt={namaLengkap}
                                    className="img-fluid rounded-circle shadow mb-3"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = logoGKJ; }}
                                />

                                <h5 className="fw-bold mb-1 text-danger">{namaLengkap || '-'}</h5>
                                <p className="text-muted small mb-0 fw-bold">
                                    <FontAwesomeIcon icon={faUserTag} className="me-1"/> {jabatanPendeta || 'PENDETA'}
                                </p>
                                <p className="text-muted small">kodeJemaat: {pendetaData.kodeJemaat}</p>
                            </div>

                            {/* DATA DETAIL (KANAN) */}
                            <div className="col-12 col-lg-8">
                                <ul className="list-group list-group-flush">
                                    {/* Data Pribadi */}
                                    <li className="list-group-item bg-light fw-bold py-2 border-top-0">Informasi Dasar</li>
                                    {dataPribadi.map((item, index) => (
                                        <DetailListItem key={`pribadi-${index}`} label={item.label} value={item.value} />
                                    ))}

                                    {/* Detail Jabatan */}
                                    <li className="list-group-item bg-light fw-bold py-2">Detail Jabatan</li>
                                    {dataJabatan.map((item, index) => (
                                        <DetailListItem 
                                            key={`jabatan-${index}`} 
                                            label={item.label} 
                                            value={item.value} 
                                            renderHtml={item.html} // Render HTML untuk link sertifikat
                                        />
                                    ))}
                                    
                                    {/* Riwayat Pelayanan */}
                                    <li className="list-group-item bg-light fw-bold py-2">Riwayat Pelayanan</li>
                                    <li className="list-group-item py-2 px-3 border-0">
                                        {riwayatList.length > 0 ? (
                                            <ul className="list-group list-group-flush border-0">
                                                {riwayatList.map((r, index) => (
                                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center py-1 px-0">
                                                        <div>
                                                            <FontAwesomeIcon icon={faChurch} className="me-2 text-info"/>
                                                            <strong>{r.namaGereja}</strong>
                                                        </div>
                                                        <span className="badge bg-secondary">
                                                            {r.tahunMulai} - {r.tahunSelesai || 'Sekarang'}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted mt-2 mb-0">Tidak ada riwayat pelayanan gerejawi yang tercatat.</p>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HalamanDetailPendeta;