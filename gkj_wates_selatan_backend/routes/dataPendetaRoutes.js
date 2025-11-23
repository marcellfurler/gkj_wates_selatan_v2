// routes/dataPendetaRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import * as dataPendetaController from "../controllers/dataPendetaController.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// Konfigurasi upload foto
// =========================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/fotoProfil");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// =========================
// ROUTE TAMBAH PENDETA
// =========================
router.post(
  "/",
  upload.fields([{ name: "foto", maxCount: 1 }]),   // **INI WAJIB**
  dataPendetaController.tambahPendeta
);

export default router;
