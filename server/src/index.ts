// server/src/index.ts
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma";
import { authRouter } from "./routes/auth.routes";
import { technicianRouter } from "./routes/technician.routes";
import { catalogRouter } from "./routes/catalog.routes";
import { addressRouter } from "./routes/address.routes";
import { bookingRouter } from "./routes/booking.routes";
import { paymentRouter } from "./routes/payment.routes";
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
import { adminAuditRouter } from "./routes/admin.audit.routes";
import { adminDisputeRouter } from "./routes/admin.dispute.routes";
import { razorpayWebhookRouter } from "./routes/webhook.razorpay.routes";
import redis from "./config/redis";
dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Basic CORS support for browser clients (e.g. HTML test pages)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

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
app.use("/payments", paymentRouter);
app.use("/geo", geoRouter);
app.use("/location", locationRouter);
app.use("/admin/catalog", adminCatalogRouter);
app.use("/admin/technician", adminTechnicianRouter);
app.use("/admin", adminUserRouter);
app.use("/admin", adminBookingRouter);
app.use("/admin", adminPaymentRouter);
app.use("/admin", adminNotificationRouter);
app.use("/admin", adminDashboardRouter);
app.use("/admin", adminAuditRouter);
app.use("/admin", adminDisputeRouter);
app.use("/webhooks", razorpayWebhookRouter);

// Wrap Express in HTTP server for Socket.IO
const server = http.createServer(app);

// Socket.IO for live technician location tracking
const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

io.use((socket, next) => {
  try {
    const auth = socket.handshake.auth as any;
    const query = socket.handshake.query as any;
    const token = auth?.token || query?.token;
    if (!token) return next(new Error("Unauthorized"));
    const secret = process.env.JWT_SECRET;
    if (!secret) return next(new Error("JWT secret missing"));
    const payload = jwt.verify(token, secret) as any;
    (socket.data as any).user = {
      id: payload.sub as string,
      role: payload.role as "CUSTOMER" | "TECHNICIAN" | "ADMIN",
    };
    return next();
  } catch {
    return next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const user = (socket.data as any).user as
    | { id: string; role: "CUSTOMER" | "TECHNICIAN" | "ADMIN" }
    | undefined;
  if (!user) {
    socket.disconnect();
    return;
  }

  // Technicians push live location updates
  socket.on(
    "technician:location:update",
    async (payload: { lat: number; lng: number; accuracy?: number }) => {
      if (!user || user.role !== "TECHNICIAN") return;
      const { lat, lng, accuracy } = payload || ({} as any);
      if (typeof lat !== "number" || typeof lng !== "number") return;
      const key = `technician:${user.id}:location`;
      const value = JSON.stringify({
        lat,
        lng,
        accuracy: typeof accuracy === "number" ? accuracy : null,
        updatedAt: new Date().toISOString(),
      });
      try {
        await redis.set(key, value, "EX", 60 * 10); // keep for 10 minutes
      } catch (e) {
        console.error("[socket] failed to store technician location", e);
      }
      // Broadcast to anyone tracking this technician
      io.to(`technician:${user.id}`).emit("technician:location", {
        technicianUserId: user.id,
        lat,
        lng,
        accuracy: typeof accuracy === "number" ? accuracy : null,
      });
    }
  );

  // Clients (customers/admin/technician) subscribe to a booking's technician
  socket.on(
    "booking:track",
    async (payload: { bookingId: string }) => {
      const bookingId = payload?.bookingId;
      if (!bookingId || !user) return;
      try {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: {
            id: true,
            customerId: true,
            technicianId: true,
          },
        });
        if (!booking || !booking.technicianId) return;

        // Authorization: customers can track their own bookings, techs their own, admins any
        if (
          user.role === "CUSTOMER" &&
          user.id !== booking.customerId
        ) {
          return;
        }
        if (
          user.role === "TECHNICIAN" &&
          user.id !== booking.technicianId
        ) {
          return;
        }

        const techUserId = booking.technicianId;
        if (!techUserId) return;

        // Join room for this technician
        socket.join(`technician:${techUserId}`);

        // Send last known location if present
        try {
          const raw = await redis.get(`technician:${techUserId}:location`);
          if (raw) {
            const loc = JSON.parse(raw);
            socket.emit("technician:location", {
              technicianUserId: techUserId,
              lat: loc.lat,
              lng: loc.lng,
              accuracy: loc.accuracy ?? null,
            });
          }
        } catch (e) {
          console.error("[socket] failed to load technician location", e);
        }
      } catch (e) {
        console.error("[socket] booking:track error", e);
      }
    }
  );
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
