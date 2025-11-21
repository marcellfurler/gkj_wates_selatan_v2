import express from "express";
import { getSertifikatSidiBykodeJemaat } from "../controllers/dataSidiController.js";

const router = express.Router();

// ✅ Gunakan param huruf kecil agar konsisten
router.get("/:kodeJemaat", getSertifikatSidiBykodeJemaat);

export default router;
