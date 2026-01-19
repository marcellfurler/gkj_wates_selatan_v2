import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoGKJ from './assets/logoGKJ.png';
import backgroundimg2 from './assets/gkjwatesselatan2.png';
import { NavbarComponentLogin } from './components/NavbarComponent';
import Footer from "./components/footer";
const API_BASE = import.meta.env.VITE_API_BASE_URL;


const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const navigate = useNavigate();

  // Login biasa
  const handleLogin = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("namaLengkapUser", data.namaLengkapUser);

    navigate("/data");
  } catch (err) {
    console.error("❌ Login error:", err);
    alert("Terjadi kesalahan server");
  }
};


  // Ganti password
  const handleResetPassword = async () => {
    if (!username || !newPassword || !confirmPassword) {
      alert("Semua kolom wajib diisi");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Password baru dan konfirmasi tidak sama");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Password berhasil diubah, silakan login kembali");
      setForgotPassword(false);
      setPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server");
    }
  };

  return (
    <div className="card shadow-sm p-4" style={{
      width: '400px',
      backgroundColor: '#f0f0f0',
      border: 'none',
      textAlign: 'center',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <img
        src={logoGKJ}
        alt="Logo GKJ Besar"
        width="90"
        height="90"
        className="d-block mx-auto mb-4"
        style={{ objectFit: 'cover' }}
      />

      {/* Username */}
      <div className="mb-3 text-start">
        <label htmlFor="usernameInput" className="form-label">Nama Pengguna</label>
        <input
          type="text"
          className="form-control form-control-lg"
          id="usernameInput"
          placeholder="Masukkan Nama Pengguna"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ backgroundColor: '#e9ecef', border: 'none', height: '10px' }}
        />
      </div>

      {/* Password biasa */}
      {/* Password biasa */}
        {!forgotPassword && (
        <div className="mb-4 text-start">
            <label htmlFor="passwordInput" className="form-label">Kata Sandi</label>
            <div className="input-group">
            <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg"
                id="passwordInput"
                placeholder="Masukkan Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ backgroundColor: '#e9ecef', border: 'none', height: '10px' }}
            />
            <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? "Hide" : "Show"}
            </button>
            </div>
        </div>
        )}

      {/* Password baru + konfirmasi saat lupa password */}
      {/* Password baru + konfirmasi saat lupa password */}
        {forgotPassword && (
        <>
            {/* Password Baru */}
            <div className="mb-3 text-start">
            <label htmlFor="newPassword" className="form-label">Password Baru</label>
            <div className="input-group">
                <input
                type={showNewPassword ? "text" : "password"}
                className="form-control form-control-lg"
                id="newPassword"
                placeholder="Masukkan Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ backgroundColor: '#e9ecef', border: 'none', height: '10px' }}
                />
                <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                >
                {showNewPassword ? "Hide" : "Show"}
                </button>
            </div>
            </div>

            {/* Konfirmasi Password */}
            <div className="mb-3 text-start">
            <label htmlFor="confirmPassword" className="form-label">Konfirmasi Password Baru</label>
            <div className="input-group">
                <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control form-control-lg"
                id="confirmPassword"
                placeholder="Konfirmasi Password Baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ backgroundColor: '#e9ecef', border: 'none', height: '10px' }}
                />
                <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                {showConfirmPassword ? "Hide" : "Show"}
                </button>
            </div>
            </div>
        </>
        )}




      {/* Tombol login / ganti password */}
      <button
        type="button"
        className="btn btn-info btn-lg w-100 fw-bold shadow-sm"
        style={{
          backgroundColor: 'rgba(108, 117, 125, 0.7)',
          borderColor: 'rgba(108, 117, 125, 0.7)',
          color: 'white',
          padding: '10px'
        }}
        onClick={forgotPassword ? handleResetPassword : handleLogin}
      >
        {forgotPassword ? "Ganti Password" : "MASUK"}
      </button>

      {/* Tombol Lupa Password */}
      {!forgotPassword && (
        <button
          type="button"
          className="btn btn-link mt-2 text-decoration-none"
          onClick={() => setForgotPassword(true)}
        >
          Lupa Password?
        </button>
      )}
    </div>
  );
};

const HalamanLogin = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        crossOrigin="anonymous"
      />
      <NavbarComponentLogin />
      <div className="d-flex" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Kiri */}
        <div className="d-flex flex-column justify-content-center align-items-center text-white p-5"
          style={{
            flex: 1,
            backgroundImage: `url(${backgroundimg2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            backgroundAttachment: 'fixed'
          }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(0, 77, 153, 0.4)',
              zIndex: 1,
            }}
          />
    
          <div className="position-relative text-center" style={{ zIndex: 2 }}>
            {/* <Link to="/daftar" style={{ color: "white", textDecoration: "none" }}>
              <button className="btn btn-info btn-lg fw-bold shadow-lg mb-4"
                style={{
                  backgroundColor: '#004d99',
                  borderColor: '#004d99',
                  color: 'white',
                  padding: '15px 40px',
                  fontSize: '1.5rem'
                }}
              >
                DAFTAR
              </button>
            </Link>
            <p className="lead mb-5" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
              Saya belum memiliki akun, saya akan <Link to="/daftar" className="text-white text-decoration-underline fw-bold">DAFTAR</Link>
            </p> */}
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              <span className="text-white mt-5 d-block text-decoration-none" style={{ fontSize: '1.3rem', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                &larr; Kembali ke halaman awal
              </span>
            </Link>
          </div>
        </div>

        {/* Kanan */}
        <div className="d-flex justify-content-center align-items-center p-5"
          style={{
            flex: 1,
            backgroundColor: '#f8f9fa',
            padding: '50px 0',
          }}
        >
          <div style={{ marginTop: '-10vh' }}>
            <LoginForm />
          </div>
        </div>
        
      </div>
        <Footer />
    </>
  );
};

export default HalamanLogin;
