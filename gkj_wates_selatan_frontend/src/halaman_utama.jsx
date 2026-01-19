import React from 'react';
import { Link } from "react-router-dom";

// 1. Logo
import logoGKJ from './assets/logoGKJ.png';

// 2. Gambar Latar Belakang
import backgroundimg from './assets/gkjwatesselatan.png';

// Komponen Navbar
const NavbarComponent = () => (
  <header>
    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ height: '80px' }}>
      <div className="container-fluid container-lg"> {/* Menggunakan container-fluid untuk mobile, container-lg untuk desktop */}
        
        {/* Konten Navbar Brand */}
        <a className="navbar-brand d-flex align-items-center" href="#" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#004d99' }}>
          <img
            src={logoGKJ}
            alt="Logo GKJ"
            width="60"
            height="60"
            className="d-inline-block align-text-top rounded-circle me-3 flex-shrink-0" // flex-shrink-0 agar logo tidak mengecil
            style={{ objectFit: 'cover' }}
          />
          {/* Judul Gereja, disembunyikan di layar sangat kecil, tampil di layar kecil ke atas */}
          <div className="d-none d-sm-block text-truncate"> 
            <span className="d-block" style={{ lineHeight: '1.2' }}>GEREJA KRISTEN JAWA</span>
            <span className="d-block" style={{ lineHeight: '1.2' }}>WATES SELATAN</span>
          </div>
          {/* Hanya menampilkan 'GKJ' di layar sangat kecil (<576px) */}
          <div className="d-sm-none"> 
            <span className="d-block" style={{ lineHeight: '1.2' }}>GKJ WATES SELATAN</span>
          </div>
        </a>
        
        {/* Tambahkan elemen lain di sini jika ada menu navigasi lain, menggunakan navbar-toggler untuk tombol hamburger */}
        
      </div>
    </nav>
  </header>
);

// Komponen Jumbotron
const JumbotronSection = () => (
  <div 
    className="text-white d-flex flex-column justify-content-center align-items-center text-center p-3 p-md-5" // p-3 untuk mobile, p-md-5 untuk desktop
    style={{
      // Menggunakan tinggi viewport penuh dikurangi tinggi navbar
      height: 'calc(100vh - 80px)', 
      backgroundImage: `url(${backgroundimg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Overlay dengan Blur */}
    <div 
      className="position-absolute top-0 start-0 w-100 h-100"
      style={{
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1,
      }}
    ></div>

    {/* Konten Utama Jumbotron */}
    <div className="container position-relative" style={{ zIndex: 2 }}>
      
      {/* Judul Utama */}
      {/* Ukuran font responsif: display-5 untuk mobile, display-4 untuk tablet/desktop */}
      <h1 className="display-5 display-md-4 fw-bold mb-3 mb-md-4" style={{ letterSpacing: '1px', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
        SELAMAT DATANG DI <br />
        GEREJA KRISTEN JAWA <br />
        JEMAAT WATES SELATAN
      </h1>
      
      {/* Paragraf Deskripsi */}
      {/* Ukuran font dan margin responsif */}
      <p className="lead mb-4 mb-md-5 mx-auto" style={{ maxWidth: '700px', fontSize: '1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
        Ini adalah halaman khusus admin, dan jika anda ingin mengakses seluruh halaman, anda dapat memilih menu <b>masuk</b> jika sudah terdaftar atau <b>daftar</b> sebagai admin baru
      </p>
      
      {/* Tombol Aksi */}
      {/* Menggunakan kelas flex-column di mobile (d-flex flex-column) dan gap-2, lalu kembali ke flex-row di tablet ke atas (flex-md-row gap-md-3) */}
      <div className="d-flex flex-column flex-sm-row justify-content-center gap-1 gap-sm-2"> 
        {/* Tombol DAFTAR: Hapus w-100 di button, biarkan w-100 w-sm-auto di Link */}
        {/* <Link to="/daftar" style={{ color: "white", textDecoration: "none" }} className=" w-sm-auto">
            <button 
                type="button" 
                // Ubah class tombol: Hapus w-100 agar di desktop lebarnya sesuai konten
                className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow-lg" 
                style={{ backgroundColor: '#004d99', borderColor: '#004d99' }}
            >
                DAFTAR
            </button>
        </Link> */}


        
        {/* Tombol MASUK: Hapus w-100 di button, biarkan w-100 w-sm-auto di Link */}
        <Link to="/login" style={{ color: "white", textDecoration: "none" }} className=" w-sm-auto">
            <button 
                type="button" 
                // Ubah class tombol: Hapus w-100 agar di desktop lebarnya sesuai konten
                className="btn btn-secondary btn-lg px-5 py-3 fw-bold shadow-lg" 
                style={{ backgroundColor: 'rgba(108, 117, 125, 0.7)', borderColor: 'rgba(108, 117, 125, 0.7)', backdropFilter: 'blur(2px)' }}
            >
                MASUK
            </button>
        </Link>
    </div>
    </div>
  </div>
);

// Komponen utama
const HalamanUtama = () => {
  return (
    <>
      <NavbarComponent />
      <JumbotronSection />
    </>
  );
};

export default HalamanUtama;
