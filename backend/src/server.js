import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("NutriFlow API radi 🚀");
});

app.listen(PORT, () => {
  console.log(`Server radi na portu ${PORT}`);
});