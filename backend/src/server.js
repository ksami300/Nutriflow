const express = require("express");
const cors = require("cors");

const app = express();

// ✅ CORS (open za debug)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ✅ ROOT
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "NutriFlow backend radi 🚀"
  });
});

// ✅ HEALTH (Railway koristi ovo)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ✅ TEST
app.get("/api/test", (req, res) => {
  res.json({ msg: "API radi kako treba 🔥" });
});

// 🔥 KLJUČNO
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 🔥 OVO DODAJ (SPREČAVA CRASH)
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE:", err);
});