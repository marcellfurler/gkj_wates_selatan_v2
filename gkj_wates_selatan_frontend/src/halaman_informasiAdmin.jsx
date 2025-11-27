import React, { useState, useEffect } from "react";
import { NavbarComponent } from "./components/NavbarComponent";
import Footer from "./components/footer";


const AdminProfile = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // State untuk ganti password
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/admin/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAdminInfo(data))
      .catch((err) => console.error(err));
  }, []);

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Semua kolom wajib diisi");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Password baru dan konfirmasi tidak sama");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminInfo.username, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Password berhasil diubah");
      setChangePassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server");
    }
  };

  if (!adminInfo) return <p className="text-center mt-5">Memuat data admin...</p>;

  return (
    <>
      <NavbarComponent />
      <div className="container mt-5">
        <div className="card shadow-sm p-4" style={{ maxWidth: "520px", margin: "auto" }}>
          <h3 className="text-center mb-4 fw-bold">Informasi Admin</h3>

          <div className="mb-3">
            <label className="form-label fw-bold">Nama Lengkap</label>
            <input type="text" className="form-control" value={adminInfo.namaLengkapUser} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Username</label>
            <input type="text" className="form-control" value={adminInfo.username} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Kontak</label>
            <input type="text" className="form-control" value={adminInfo.nomorHP} disabled />
          </div>

          {/* Password lama */}
          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={adminInfo.password}
                disabled
              />
              <button className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Tombol Ganti Password */}
          {!changePassword && (
            <button
              className="btn btn-info w-100 mb-3"
              onClick={() => setChangePassword(true)}
            >
              Ganti Password
            </button>
          )}

          {/* Input Password Baru */}
          {changePassword && (
            <>
              <div className="mb-3 text-start">
                <label className="form-label fw-bold">Password Baru</label>
                <div className="input-group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="mb-3 text-start">
                <label className="form-label fw-bold">Konfirmasi Password Baru</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button className="btn btn-success w-100" onClick={handleUpdatePassword}>
                Simpan Password Baru
              </button>
            </>
          )}
        </div>
      </div>
        <Footer/>
    </>
  );
};

export default AdminProfile;
