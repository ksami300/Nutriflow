const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { createPlan, getPlans } = require("../controllers/mealPlanController");

router.post("/", auth, createPlan);
router.get("/", auth, getPlans);

module.exports = router;