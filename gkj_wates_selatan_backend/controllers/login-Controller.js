import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

const SECRET = "RAHASIA_SUPER_SECRET";

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM adminsignups WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Username tidak ditemukan" });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      username: user.username,
      namaLengkapUser: user.namaLengkapUser
    });

  } catch (error) {
    console.error("❌ Error login:", error);
    res.status(500).json({ message: "Kesalahan server" });
  }
};




export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Token tidak ada" });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token tidak valid" });
        req.user = user;
        next();
    });
};



// Logout
export const logout = (req, res) => {
  res.json({ message: "Logout berhasil" });
};


// REGISTER USER
export const registerUser = async (req, res) => {
  const { namaLengkapUser, username, nomorHP, password } = req.body;

  if (!namaLengkapUser || !username || !nomorHP || !password) {
    return res.status(400).json({ message: "Semua kolom wajib diisi" });
  }

  try {
    // Cek username
    const [cekUser] = await db.query(
      "SELECT * FROM adminsignups WHERE username = ?",
      [username]
    );

    if (cekUser.length > 0) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    // Simpan langsung password tanpa hash
    await db.query(
      "INSERT INTO adminsignups (namaLengkapUser, username, nomorHP, password) VALUES (?, ?, ?, ?)",
      [namaLengkapUser, username, nomorHP, password]
    );

    res.status(201).json({ message: "Registrasi berhasil" });

  } catch (error) {
    console.error("❌ Error register:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// GET profile admin

export const getAdminProfile = async (req, res) => {
  try {
    // Ambil username dari token
    const username = req.user.username;

    const [rows] = await db.query(
      "SELECT username, namaLengkapUser, password, nomorHP FROM adminsignups WHERE username = ?",
      [username]
    );


    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error getAdminProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) return res.status(400).json({ message: "Semua kolom wajib diisi" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM adminsignups WHERE username = ?",
      [username]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Username tidak ditemukan" });

    await db.query(
      "UPDATE adminsignups SET password = ? WHERE username = ?",
      [newPassword, username]
    );

    res.json({ message: "Password berhasil diubah" });
  } catch (err) {
    console.error("Error resetPassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};
