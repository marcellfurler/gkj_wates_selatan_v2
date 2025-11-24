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

        // Buat token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET,
            { expiresIn: "1d" }
        );

        // Kirim response
        res.json({
            message: "Login berhasil",
            token,
            username: user.username,
            namaLengkapUser: user.namaLengkapUser // harus sesuai kolom di DB
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

