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
app.use(cors());
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
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di: http://localhost:${PORT}`);
});
