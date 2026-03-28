import express from "express";
import { addLog, getLogs  } from "../controllers/logController.js";


const router = express.Router();

router.post('/', addLog);
router.get('/', getLogs);

export default router;

