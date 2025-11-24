import express from "express";
import { login, logout, verifyToken, registerUser } from "../controllers/login-Controller.js";
import { getAllJemaat } from "../controllers/dataJemaatController.js";

const router = express.Router();

// Auth
router.post("/login", login);
router.post("/logout", logout);

// Route yang butuh token
router.get("/jemaat", verifyToken, getAllJemaat);
router.post("/register", registerUser);

export default router;
