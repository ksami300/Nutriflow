const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const premiumMiddleware = require('../middleware/premiumMiddleware');
const validateRequest = require("../middleware/validateRequest");
const { mealPlanSchema } = require("../validation/schemas");
const {
  createMealPlan,
  getMealPlans,
  getGroceryList,
  shareMealPlan,
  deleteMealPlan,
} = require("../controllers/mealPlanController");

// 🛡️ 1. KREIRANJE PLANA (Zaštićeno i autentifikacijom i PREMIUM štitom da čuvamo OpenAI tokene!)
router.post("/", [authMiddleware, premiumMiddleware, validateRequest(mealPlanSchema)], createMealPlan);

// 🟢 2. PREUZIMANJE SVIH PLANOVA KORISNIKA
router.get("/", authMiddleware, getMealPlans);

// 🛒 3. GENERISANJE LISTE ZA KUPOVINU
router.get("/:id/groceries", authMiddleware, getGroceryList);

// 🌐 4. GENERISANJE JAVNOG LINKA ZA DELJENJE (Spaja plan sa živom Vercel platformom)
router.post("/:id/share", authMiddleware, shareMealPlan);

// 🗑️ 5. HIRURŠKO BRISANJE INDIVIDUALNOG PLANA KORISNIKA
router.delete("/:id", authMiddleware, deleteMealPlan);

module.exports = router;
