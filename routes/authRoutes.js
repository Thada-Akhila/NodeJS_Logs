import express from "express";
import {
  register,
  login,
  logout,
  getProfile
} from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";


const router = express.Router();

// session-based auth routes (commented out for now)
// router.post("/register", register);
// router.post("/login", login);
// router.get("/logout", logout);
// router.get("/profile", getProfile);

// JWT-based auth routes
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/profile", verifyJWT, getProfile);

export default router;