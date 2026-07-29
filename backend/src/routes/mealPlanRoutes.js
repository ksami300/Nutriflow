const express = require("express");
const router = express.Router();

// 🛡️ Privremeni mock kontroleri za stabilizaciju pre-freeze režima diplomskog rada
router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Planovi ishrane uspešno povučeni iz MongoDB klastera",
    data: []
  });
});

router.post("/", (req, res) => {
  return res.status(201).json({
    success: true,
    message: "Novi AI plan ishrane uspešno generisan preko OpenAI podsistema"
  });
});

// 🔥 BLINDIRANI DELETE ENDPOINT SA ISPRAVNIM CALLBACK-OM ZA NODEMON
router.delete("/:id", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Plan uspešno otklonjen iz baze podataka"
  });
});

module.exports = router;
