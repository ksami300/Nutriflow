const express = require("express");
const app = express();

// middleware
app.use(express.json());

// TEST ROUTE (BITNO ZA RAILWAY)
app.get("/", (req, res) => {
  res.send("NutriFlow backend radi 🚀");
});

// PORT (RAILWAY koristi process.env.PORT)
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});