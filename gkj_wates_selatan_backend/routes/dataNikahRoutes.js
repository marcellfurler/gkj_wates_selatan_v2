import express from "express";
import { getSertifikatNikahBykodeJemaat } from "../controllers/dataNikahController.js";

const router = express.Router();

// param harus lowercase dan sama dengan controller
router.get("/:kodeJemaat", getSertifikatNikahBykodeJemaat);

export default router;
