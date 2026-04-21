const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS (za sada otvoren)
app.use(cors({
  origin: "*"
}));

// ✅ Middleware
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("NutriFlow API working 🚀");
});

// ✅ Healthcheck (Railway koristi ovo)
app.get("/api/test", (req, res) => {
  res.json({
    message: "API works 🚀"
  });
});

// ✅ TEST LOGIN (privremeno dok ne napravimo pravi auth)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // 🔥 fake login za test
  if (email === "demo@example.com" && password === "password123") {
    return res.json({
      token: "test-token-123"
    });
  }

  return res.status(401).json({
    message: "Invalid credentials"
  });
});

// ✅ PORT (Railway obavezno koristi ovo)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});