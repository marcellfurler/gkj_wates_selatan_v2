import express from "express";
import { login, logout, verifyToken, registerUser, getAdminProfile, resetPassword } from "../controllers/login-Controller.js";
import { getAllJemaat } from "../controllers/dataJemaatController.js";

const router = express.Router();

// Auth
router.post("/login", login);
router.post("/logout", logout);

// Route yang butuh token
router.get("/jemaat", verifyToken, getAllJemaat);
router.post("/register", registerUser);

router.get("/profile", verifyToken, getAdminProfile);
router.post('/admin/reset-password', resetPassword);


export default router;
