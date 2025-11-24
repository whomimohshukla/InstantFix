// server/src/index.ts
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import { authRouter } from "./routes/auth.routes";
import { technicianRouter } from "./routes/technician.routes";

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ db: "DATABASE UP" });
  } catch (e) {
    res.status(500).json({ db: "down", error: String(e) });
  }
});

// Mount routes
app.use("/auth", authRouter);
app.use("/technician", technicianRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
