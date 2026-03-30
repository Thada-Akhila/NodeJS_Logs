import express from "express";
import { addLog, getLogs } from "../controllers/logController.js";
import { slidingWindowLimiter } from "../middlewares/slidingWindowLimiter.js";


const router = express.Router();

//  APPLY RATE LIMITER HERE


router.post("/", slidingWindowLimiter, addLog);

router.get("/", getLogs);

export default router;