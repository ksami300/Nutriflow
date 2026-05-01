const express = require("express");
const router = express.Router();
const validateRequest = require("../middleware/validateRequest");
const { mealPlanSchema } = require("../validation/schemas");
const {
  generatePlan,
  getPlans,
  deletePlan,
} = require("../controllers/mealPlanController");
const authMiddleware = require("../middleware/authMiddleware");
const premiumMiddleware = require("../middleware/premiumMiddleware");

router.post("/", authMiddleware, validateRequest(mealPlanSchema), generatePlan);
router.get("/", authMiddleware, getPlans);
router.delete("/:id", authMiddleware, deletePlan);
router.get("/premium-only", authMiddleware, premiumMiddleware, (req, res) => {
  res.json({ message: "Premium access confirmed" });
});

module.exports = router;
