import express from "express";
import {
  getTotalJemaat,
  getStatistikPepanthan,
  getStatistikBaptis,
  getStatistikSidi,
  getStatistikNikah
} from "../controllers/statistikController.js";

const router = express.Router();

router.get("/total", getTotalJemaat);
router.get("/pepanthan", getStatistikPepanthan);

router.get("/baptis", getStatistikBaptis);
router.get("/sidi", getStatistikSidi);
router.get("/nikah", getStatistikNikah);

export default router;
