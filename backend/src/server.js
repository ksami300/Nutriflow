const express = require("express");
const cors = require("cors");

const app = express();

// ✅ CORS OPEN
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ ROOT
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "NutriFlow backend radi 🚀"
  });
});

// ✅ HEALTH
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ✅ TEST
app.get("/api/test", (req, res) => {
  res.json({ msg: "API radi kako treba 🔥" });
});

// 🔥 NAJBITNIJE
const PORT = process.env.PORT || 8080;

// ❗ KLJUČNO: BEZ HOST PARAMETRA
app.listen(PORT, () => {
  console.log("✅ SERVER STARTED ON PORT:", PORT);
});