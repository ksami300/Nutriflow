const express = require("express");
const router = express.Router();

const {
  generatePlan,
  getPlans,
  deletePlan
} = require("../controllers/mealPlanController");

const authMiddleware = require("../middleware/authMiddleware");

// ROUTES
router.post("/", authMiddleware, generatePlan);
router.get("/", authMiddleware, getPlans);
router.delete("/:id", authMiddleware, deletePlan);

module.exports = router;