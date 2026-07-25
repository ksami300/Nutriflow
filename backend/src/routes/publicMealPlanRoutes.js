const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan'); // Pretpostavka šeme tvog modela planova

// 🌐 JAVNA I OTVORENA RUTE: Omogućava bilo kome na internetu da vidi podeljeni plan bez tokena!
router.get('/share/:id', async (req, res) => {
  try {
    const planId = req.params.id;
    
    // Hirurški pronalazimo plan ishrane u bazi podataka
    const plan = await MealPlan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({ success: false, message: "Traženi plan ishrane više ne postoji na platformi." });
    }

    // Vraćamo podatke u milimetar čisto
    return res.status(200).json({
      success: true,
      message: "Javni plan ishrane uspešno povučen za deljenje!",
      data: plan
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
