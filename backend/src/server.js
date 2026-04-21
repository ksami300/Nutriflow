const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS (production kasnije zaključavamo)
app.use(cors({
  origin: "*"
}));

// ✅ Middleware
app.use(express.json());

// =======================
// ROUTES
// =======================

// ROOT
app.get("/", (req, res) => {
  res.send("NutriFlow API working 🚀");
});

// ✅ HEALTHCHECK (OBAVEZNO ZA RAILWAY)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ✅ TEST API
app.get("/api/test", (req, res) => {
  res.status(200).json({
    message: "API works 🚀"
  });
});

// ✅ LOGIN (test verzija)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "demo@example.com" && password === "password123") {
    return res.status(200).json({
      token: "test-token-123"
    });
  }

  return res.status(401).json({
    message: "Invalid credentials"
  });
});

// =======================
// START SERVER
// =======================

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});