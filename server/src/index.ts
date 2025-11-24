// server/src/index.ts
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import { authRouter } from "./routes/auth.routes";
import { technicianRouter } from "./routes/technician.routes";
import { catalogRouter } from "./routes/catalog.routes";
import { addressRouter } from "./routes/address.routes";
import { bookingRouter } from "./routes/booking.routes";
import { geoRouter } from "./routes/geo.routes";
import { locationRouter } from "./routes/location.routes";
import { profileRouter } from "./routes/profile.routes";
import { adminCatalogRouter } from "./routes/admin.catalog.routes";
import { adminTechnicianRouter } from "./routes/admin.technician.routes";
import { adminUserRouter } from "./routes/admin.user.routes";
import { adminBookingRouter } from "./routes/admin.booking.routes";
import { adminPaymentRouter } from "./routes/admin.payment.routes";
import { adminNotificationRouter } from "./routes/admin.notification.routes";
import { adminDashboardRouter } from "./routes/admin.dashboard.routes";
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
app.use("/catalog", catalogRouter);
app.use("/me", addressRouter);
app.use("/me", profileRouter);
app.use("/bookings", bookingRouter);
app.use("/geo", geoRouter);
app.use("/location", locationRouter);
app.use("/admin/catalog", adminCatalogRouter);
app.use("/admin/technician", adminTechnicianRouter);
app.use("/admin", adminUserRouter);
app.use("/admin", adminBookingRouter);
app.use("/admin", adminPaymentRouter);
app.use("/admin", adminNotificationRouter);
app.use("/admin", adminDashboardRouter);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
