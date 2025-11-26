import express from "express";
import {
  getTotalJemaat,
  getStatistikPepanthan,
  getStatistikBaptis,
  getStatistikSidi,
  getStatistikNikah,
  getStatistikJenisKelamin,
  getPepanthanUsia,
} from "../controllers/statistikController.js";

const router = express.Router();

router.get("/total", getTotalJemaat);
router.get("/pepanthan", getStatistikPepanthan);

router.get("/baptis", getStatistikBaptis);
router.get("/sidi", getStatistikSidi);
router.get("/nikah", getStatistikNikah);
router.get("/jenisKelamin", getStatistikJenisKelamin);
router.get("/pepanthan-usia", getPepanthanUsia);


export default router;
