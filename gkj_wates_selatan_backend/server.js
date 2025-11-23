import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser"; 

// Import semua routes
import dataJemaatRoutes from "./routes/dataJemaatRoutes.js";
// import dataNikahRoutes from "./routes/dataNikahRoutes.js";
// import dataSidiRoutes from "./routes/dataSidiRoutes.js";
// import dataBaptisRoutes from "./routes/dataBaptisRoutes.js";
import dataPendetaRoutes from "./routes/dataPendetaRoutes.js"; // ✅ IMPOR ROUTE PENDETA
import suratRoutes from "./routes/suratRoutes.js";

const app = express();

// ================================
// ✅ Middleware utama
// ================================
app.use(cors());

// body-parser agar bisa membaca form dan JSON sekaligus
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================================
// ✅ Path dan direktori upload
// ================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pastikan folder uploads bisa diakses publik
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================================
// ✅ Routes utama
// ================================
app.use("/api/jemaat", dataJemaatRoutes);
app.use("/api/pendeta", dataPendetaRoutes); // ✅ GUNAKAN ROUTE PENDETA
app.use("/api/surat", suratRoutes);

// ================================
// ✅ Route default (untuk test)
// ================================
app.get("/", (req, res) => {
  res.send("✅ Server GKJ Backend aktif dan berjalan 🚀");
});

// ================================
// ✅ Jalankan server
// ================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di: http://localhost:${PORT}`);
});