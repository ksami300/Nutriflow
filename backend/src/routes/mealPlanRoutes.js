import express from "express";
import { createMealPlan, getMealPlans } from "../controllers/mealPlanController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createMealPlan);
router.get("/", protect, getMealPlans);

export default router;