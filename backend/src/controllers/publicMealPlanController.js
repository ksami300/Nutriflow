const MealPlan = require("../models/MealPlan");

// 🌐 JAVNI KONTROLER: Povlači plan ishrane iz MongoDB prstena bez provere JWT tokena!
exports.getPublicMealPlan = async (req, res) => {
  try {
    const planId = req.params.id;

    // Hirurški tražimo plan preko ID parametra
    const plan = await MealPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Javni plan ishrane koji tražite nije pronađen ili je uklonjen."
      });
    }

    // Vraćamo plan čist kao suza pravo na javni frontend prozor
    return res.status(200).json({
      success: true,
      message: "Javni plan uspešno povučen sa servera!",
      data: plan
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
