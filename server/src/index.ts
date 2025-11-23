import express from "express";
import morgan from "morgan";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());

// Colorful HTTP logs (method, status, response time)
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
