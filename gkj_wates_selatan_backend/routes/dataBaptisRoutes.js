import express from "express";
import { getSertifikatBaptisBykodeJemaat } from "../controllers/dataBaptisController.js";

const router = express.Router();

router.get("/:kodeJemaat", getSertifikatBaptisBykodeJemaat);

export default router;
