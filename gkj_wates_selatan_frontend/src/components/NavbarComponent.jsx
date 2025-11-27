

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoGKJ from "../assets/logoGKJ.png";

export const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // cek apakah user login
  const token = localStorage.getItem("token");
  const namaLengkapUser = localStorage.getItem("namaLengkapUser");

  // fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("namaLengkapUser");

    alert("Logout berhasil!");
    navigate("/");
  };

  // helper untuk style active menu
  const isActiveExact = (path) => location.pathname === path;
  const isActiveStartsWith = (path) => location.pathname.startsWith(path);

  const linkStyle = (active) => ({
    fontSize: "1.1rem",
    color: active ? "white" : "#004d99",
    backgroundColor: active ? "#004d97" : "transparent",
    borderRadius: active ? "5px" : "0px",
    transition: "0.3s",
  });

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

              {/* Menu Biasa */}
              <li className="nav-item">
                <Link className="nav-link" to="/data" style={linkStyle(isActiveExact("/data"))}>
                  Data
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/dataBaru" style={linkStyle(isActiveExact("/dataBaru"))}>
                  Data Baru
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/surat" style={linkStyle(isActiveExact("/surat"))}>
                  Surat
                </Link>
              </li>

              {/* Dropdown Statistik & Visualisasi */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={linkStyle(isActiveStartsWith("/statistik") || isActiveStartsWith("/demografi"))}
                >
                  Statistik & Visualisasi
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/statistik">
                      Statistik
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/demografi">
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
                      <Link className="dropdown-item" to="/informasiAdmin">
                        Informasi {namaLengkapUser?.split(" ")[0]}
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item text-success" to="/developer">
                        Developer
                      </Link>
                    </li>

                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
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
