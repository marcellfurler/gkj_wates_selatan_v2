import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import * as dataJemaatController from "../controllers/dataJemaatController.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pastikan folder ada
function ensureFolderExists(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    if (file.fieldname === "foto") {
      folder = path.join(__dirname, "../uploads/fotoProfil");
    } 
    else if (file.fieldname === "sertifikatNikah") {
      folder = path.join(__dirname, "../uploads/sertifikat/nikah");
    } 
    else if (file.fieldname === "sertifikatSidi") {
      folder = path.join(__dirname, "../uploads/sertifikat/sidi");
    } 
    else if (file.fieldname === "sertifikatBaptis") {
      folder = path.join(__dirname, "../uploads/sertifikat/baptis");
    } 
    else if (file.fieldname === "sertifikatPendeta") {
      folder = path.join(__dirname, "../uploads/sertifikat/pendeta");
    }
    else if (file.fieldname === "sertifikat") {
      folder = path.join(__dirname, "../uploads/sertifikat/update");
    }

    ensureFolderExists(folder);
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// =========================
// ROUTES
// =========================

// GET semua jemaat
router.get("/", dataJemaatController.getAllJemaat);

// POST tambah jemaat biasa
router.post(
  "/",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "sertifikatNikah", maxCount: 1 },
    { name: "sertifikatSidi", maxCount: 1 },
    { name: "sertifikatBaptis", maxCount: 1 },
    { name: "sertifikatPendeta", maxCount: 1 }, // tetap ada, tapi tidak digunakan di tambahJemaat
  ]),
  dataJemaatController.tambahJemaat
);

// PUT update jemaat
router.put(
  "/:kodeJemaat",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "sertifikatNikah", maxCount: 1 },
    { name: "sertifikatSidi", maxCount: 1 },
    { name: "sertifikatBaptis", maxCount: 1 },
    { name: "sertifikatPendeta", maxCount: 1 },
  ]),
  dataJemaatController.updateJemaat
);

// =========================
// TAMBAHAN: ROUTE UNTUK PENDETA
// =========================
router.post(
  "/pendeta",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "sertifikatPendeta", maxCount: 1 },
  ]),
  dataJemaatController.tambahPendeta
);

// Hapus jemaat
router.delete("/hapus/:kodeJemaat", dataJemaatController.hapusJemaat);

export default router;
