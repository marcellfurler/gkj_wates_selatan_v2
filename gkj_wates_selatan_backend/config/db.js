// config/db.js
import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // ganti sesuai MySQL kamu
  database: "gkj_wates_selatan_v3" // ganti sesuai nama database kamu
});

db.connect((err) => {
  if (err) {
    console.error("❌ Gagal konek database:", err);
  } else {
    console.log("✅ Database terhubung");
  }
});
