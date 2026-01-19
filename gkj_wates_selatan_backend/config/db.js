import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";


export const db = mysql.createPool({
  host: process.env.DB_HOST,   // ⬅️ TANPA fallback
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

console.log(
  `✅ Database pool siap digunakan. Host: ${process.env.DB_HOST}, User: ${process.env.DB_USER}`
);
