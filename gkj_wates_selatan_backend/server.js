import dotenv from "dotenv";
dotenv.config(); // HARUS sebelum import db.js


import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser"; 

// Import routes
import dataJemaatRoutes from "./routes/dataJemaatRoutes.js";
import dataPendetaRoutes from "./routes/dataPendetaRoutes.js";
import suratRoutes from "./routes/suratRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import statistikRoutes from "./routes/statistikRoutes.js";

const app = express();

// ================================
// Middleware utama
// ================================
// app.use(cors({
//   origin: "http://192.168.100.72:3000",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//  credentials: true
//}));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://192.168.100.72:3000",
      "https://jimm.labjaringanukdw.my.id"
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // ❗ JANGAN throw error
    }
  },
  credentials: true
}));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================================
// Path static untuk uploads
// ================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================================
// Routes utama
// ================================
app.use("/api/jemaat", dataJemaatRoutes);
app.use("/api/pendeta", dataPendetaRoutes);
app.use("/api/surat", suratRoutes);
app.use("/api", loginRoutes);
app.use("/api/statistik", statistikRoutes);
app.use("/api/admin", loginRoutes);



// ================================
// Route default test
// ================================
app.get("/", (req, res) => {
  res.send("✅ Server GKJ Backend aktif dan berjalan 🚀");
});

// ================================
// Jalankan server
// ================================
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server berjalan di port ${PORT}`);
});
