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
    if (file.fieldname === "foto") folder = path.join(__dirname, "../uploads/fotoProfil");
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

// POST tambah jemaat (bisa tambah foto)
router.post("/", upload.single("foto"), dataJemaatController.tambahJemaat);

// PUT update jemaat (opsional ganti foto)
router.put("/:kodeJemaat", upload.single("foto"), dataJemaatController.updateJemaat);

// DELETE jemaat
router.delete("/hapus/:kodeJemaat", dataJemaatController.hapusJemaat);

export default router;
