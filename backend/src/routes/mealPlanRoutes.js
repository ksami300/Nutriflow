const premiumMiddleware = require('../middleware/premiumMiddleware');
const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const { mealPlanSchema } = require("../validation/schemas");
const {
  createMealPlan,
  getMealPlans,
  getGroceryList,
  shareMealPlan,
  deleteMealPlan,
} = require("../controllers/mealPlanController");

router.post("/", authMiddleware, validateRequest(mealPlanSchema), createMealPlan);
router.get("/", authMiddleware, getMealPlans);
router.get("/:id/groceries", authMiddleware, getGroceryList);
router.post("/:id/share", authMiddleware, shareMealPlan);
router.delete("/:id", authMiddleware, deleteMealPlan);

module.exports = router;
