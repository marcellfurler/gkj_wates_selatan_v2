import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logoGKJ from "../assets/logoGKJ.png";

export const NavbarComponent = () => {
  const navigate = useNavigate();

  // cek apakah user login
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const namaLengkapUser = localStorage.getItem("namaLengkapUser");

  // function logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("namaLengkapUser");

    alert("Logout berhasil!");
    navigate("/");
  };

  return (
    <header>
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{
          height: "80px",
          backgroundColor: "#ecececff",
          position: "sticky",
          top: 0,
          zIndex: 1050,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div className="container-fluid container">
          {/* Logo */}
          <Link
            className="navbar-brand d-flex align-items-center"
            to="/"
            style={{ fontSize: "1.1rem", fontWeight: "600", color: "#004d99" }}
          >
            <img
              src={logoGKJ}
              alt="Logo GKJ"
              width="60"
              height="60"
              className="d-inline-block align-text-top rounded-circle me-3"
              style={{ objectFit: "cover" }}
            />
            <div className="d-none d-sm-block text-truncate">
              <span className="d-block" style={{ lineHeight: "1.2" }}>
                GEREJA KRISTEN JAWA
              </span>
              <span className="d-block" style={{ lineHeight: "1.2" }}>
                WATES SELATAN
              </span>
            </div>
          </Link>

          {/* Toggler (mobile) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div
            className="collapse navbar-collapse"
            id="navbarNavDropdown"
            style={{
              backgroundColor: "#ecececff",
              zIndex: 1050,
              position: "relative",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/data" style={{ fontSize: "1.1rem" }}>
                  Data
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/surat" style={{ fontSize: "1.1rem" }}>
                  Surat
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/dataBaru" style={{ fontSize: "1.1rem" }}>
                  Data Baru
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="#" style={{ fontSize: "1.1rem" }}>
                  Statistik
                </Link>
              </li>

              

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ fontSize: "1.1rem" }}
                >
                  Visualisasi
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="#">
                      Organisasi
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Demografi
                    </Link>
                  </li>
                </ul>
              </li>

              

              {/* Dropdown admin */}
              {token ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Hello, {namaLengkapUser?.split(" ")[0]} 👋
                  </a>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="#">
                        Informasi {namaLengkapUser?.split(" ")[0]}
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                // Jika belum login → tampilkan tombol login
                <li className="nav-item">
                  <Link className="nav-link" to="/login" style={{ fontSize: "1.1rem" }}>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

// Navbar khusus halaman login (tanpa menu)
export const NavbarComponentLogin = () => (
  <header>
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{
        height: "80px",
        position: "sticky",
        top: 0,
        zIndex: 1050,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div className="container-fluid container-lg">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src={logoGKJ}
            alt="Logo GKJ"
            width="60"
            height="60"
            className="d-inline-block align-text-top rounded-circle me-3 flex-shrink-0"
            style={{ objectFit: "cover" }}
          />
          <span>GKJ WATES SELATAN</span>
        </a>
      </div>
    </nav>
  </header>
);
