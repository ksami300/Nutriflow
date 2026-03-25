import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { aiCoach } from "../controllers/aiController.js";

const router = express.Router();

router.post("/", protect, aiCoach);

export default router;