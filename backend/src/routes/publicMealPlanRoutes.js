const router = require("express").Router();
const { getPublicMealPlan } = require("../controllers/mealPlanController");

router.get("/meal-plans/:id", getPublicMealPlan);

module.exports = router;
