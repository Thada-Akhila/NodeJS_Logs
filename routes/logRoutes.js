import express from "express";
import { addLog, getLogs } from "../controllers/logController.js";
import { logRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// 🔥 APPLY RATE LIMITER HERE
router.post("/", logRateLimiter, addLog);

router.get("/", getLogs);

export default router;