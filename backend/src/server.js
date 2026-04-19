const express = require("express");
const cors = require("cors");

const app = express();

// ✅ CORS (PRODUCTION READY)
const cors = require("cors");

// 🔥 NAJBITNIJE (open CORS za debug)
app.use(cors());

app.use(express.json());

// ✅ ROOT
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "NutriFlow backend radi 🚀",
  });
});

// ✅ HEALTH (Railway)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ✅ TEST API
app.get("/api/test", (req, res) => {
  res.json({ msg: "API radi kako treba 🔥" });
});

// PORT
const PORT = process.env.PORT || 8080;

// START
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});