import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoGKJ from './assets/logoGKJ.png';
import backgroundimg2 from './assets/gkjwatesselatan2.png';
import { NavbarComponentLogin } from './components/NavbarComponent';
import Footer from "./components/footer";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// =======================
// Komponen Form Daftar
// =======================
const RegisterForm = () => {
    const navigate = useNavigate();

    // State untuk menampung input form
    const [formData, setFormData] = useState({
        namaLengkapUser: "",
        username: "",
        nomorHP: "",   // email ATAU nomor hp
        password: ""
    });


    // Fungsi untuk handle input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    // Fungsi untuk submit data ke backend
    const handleSubmit = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Pendaftaran gagal");
                return;
            }

            alert("Pendaftaran berhasil!");
            navigate("/login"); // redirect ke login

        } catch (error) {
            console.error("❌ Error:", error);
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
                alt="Logo GKJ"
                width="90"
                height="90"
                className="d-block mx-auto mb-3"
                style={{ objectFit: 'cover' }}
            />

            {/* Nama Lengkap */}
            <div className="mb-2 text-start">
                <label className="form-label">Nama Lengkap</label>
                <input
                    type="text"
                    id="namaLengkapUser"
                    className="form-control form-control-lg"
                    style={{ backgroundColor: '#e9ecef', border: 'none', height: '50px' }}
                    onChange={handleChange}
                />
            </div>

            {/* Nama Pengguna */}
            <div className="mb-2 text-start">
                <label className="form-label">Nama Pengguna</label>
                <input
                    type="text"
                    id="username"
                    className="form-control form-control-lg"
                    style={{ backgroundColor: '#e9ecef', border: 'none', height: '50px' }}
                    onChange={handleChange}
                />
            </div>

            {/* Email */}
            <div className="mb-2 text-start">
                <label className="form-label">Nomor HP</label>
                <input
                    type="text"
                    id="nomorHP"
                    className="form-control form-control-lg"
                    style={{ backgroundColor: '#e9ecef', border: 'none', height: '50px' }}
                    onChange={handleChange}
                />

            </div>

            {/* Password */}
            <div className="mb-2 text-start">
                <label className="form-label">Kata Sandi</label>
                <input
                    type="password"
                    id="password"
                    className="form-control form-control-lg"
                    style={{ backgroundColor: '#e9ecef', border: 'none', height: '50px' }}
                    onChange={handleChange}
                />
            </div>

            {/* Tombol Daftar */}
            <button
                type="button"
                className="btn btn-info btn-lg w-100 fw-bold shadow-sm"
                style={{ backgroundColor: '#004d99', borderColor: '#004d99', color: 'white', padding: '12px' }}
                onClick={handleSubmit}
            >
                DAFTAR
            </button>
        </div>
    );
};

// =======================
// HALAMAN DAFTAR UTAMA
// =======================
const HalamanDaftar = () => {
    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                crossOrigin="anonymous"
            />

            <NavbarComponentLogin />

            <div className="d-flex" style={{ height: 'calc(100vh - 80px)' }}>
                
                {/* KIRI: GAMBAR */}
                <div
                    className="d-flex flex-column justify-content-center align-items-center text-white p-5"
                    style={{
                        flex: 1,
                        backgroundImage: `url(${backgroundimg2})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        backgroundAttachment: 'fixed'
                    }}
                >

                    {/* Overlay */}
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                            backdropFilter: 'blur(10px)',
                            backgroundColor: 'rgba(0, 77, 153, 0.4)',
                            zIndex: 1,
                        }}
                    />

                    {/* Konten */}
                    <div className="position-relative text-center" style={{ zIndex: 2 }}>
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <button
                                className="btn btn-light btn-lg fw-bold shadow-lg mb-4"
                                style={{
                                    backgroundColor: 'rgba(108, 117, 125, 0.7)',
                                    color: 'white',
                                    padding: '15px 40px',
                                    fontSize: '1.5rem'
                                }}
                            >
                                MASUK
                            </button>
                        </Link>

                        <p className="lead mb-5" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                            Saya sudah memiliki akun, saya akan{" "}
                            <Link to="/login" className="text-white text-decoration-underline fw-bold">MASUK</Link>
                        </p>

                        <Link to="/" className="text-white text-decoration-none" style={{ fontSize: '1.1rem' }}>
                            &larr; Kembali ke halaman awal
                        </Link>
                    </div>
                </div>

                {/* KANAN: FORM REGISTER */}
                <div
                    className="d-flex justify-content-center align-items-center p-5"
                    style={{ flex: 1, backgroundColor: '#f8f9fa' }}
                >
                    <div className="mt-5">
                        <RegisterForm />
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default HalamanDaftar;
