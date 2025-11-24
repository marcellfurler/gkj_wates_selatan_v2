// routes/suratRoutes.js
import express from "express";
import {
  buatSuratBaru,
  getSemuaSurat,
  getSuratById,
  updateSurat,
  deleteSurat
} from "../controllers/suratController.js";

const router = express.Router();

// GET semua surat
router.get("/", getSemuaSurat);

// GET surat berdasarkan ID
// router.get("/:kodeDataSurat", getSuratById);

// POST buat surat baru
router.post("/", buatSuratBaru);

// PUT update surat
router.put("/:kodeDataSurat", updateSurat);

// DELETE hapus surat
router.delete("/:kodeDataSurat", deleteSurat);
router.get("/:kodeDataSurat", getSuratById);


export default router;
