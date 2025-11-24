// config/db.js
import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // sesuaikan
  database: "gkj_wates_selatan_v3"
});

console.log("✅ Database terhubung (promise)");
