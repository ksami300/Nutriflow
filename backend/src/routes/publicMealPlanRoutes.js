const express = require('express');
const router = express.Router();

// 🔥 UVOZ JAVNOG KONTROLERA ZA MONETIZACIJU I RETENTION DELJENJE
const { getPublicMealPlan } = require('../controllers/publicMealPlanController');

// 🌐 JAVNA I OTVORENA RUTA: Omogućava bilo kome na internetu da vidi podeljeni plan bez provere JWT tokena!
router.get('/share/:id', getPublicMealPlan);

module.exports = router;
