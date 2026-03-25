import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 👇 ovo rešava 100% path problem
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 apsolutna putanja do .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app.js";

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server radi na portu ${PORT}`);
});