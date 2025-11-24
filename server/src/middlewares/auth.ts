import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string | null;
    role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  };
}

export function authJwt(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token)
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  const secret = process.env.JWT_SECRET;
  if (!secret)
    return res.status(500).json({ ok: false, message: "JWT secret missing" });
  try {
    const payload = jwt.verify(token, secret) as any;
    req.user = {
      id: payload.sub,
      email: payload.email || null,
      role: payload.role,
    };
    return next();
  } catch (e) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}

export function requireRole(
  ...roles: Array<"CUSTOMER" | "TECHNICIAN" | "ADMIN">
) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ ok: false, message: "Forbidden" });
    return next();
  };
}
