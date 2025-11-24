import { adminUserRepo } from "../repositories/adminUser.repo";
import { UserRole, UserStatus } from "@prisma/client";

export const adminUserService = {
  async listUsers(query: any) {
    const take = Math.min(parseInt(query?.limit || "20", 10) || 20, 100);
    const skip = parseInt(query?.skip || "0", 10) || 0;
    const role = (query?.role as UserRole | undefined) || undefined;
    const status = (query?.status as UserStatus | undefined) || undefined;
    const q = (query?.q as string | undefined) || undefined;

    const [rows, total] = await Promise.all([
      adminUserRepo.listUsers({ q, role, status, take, skip }),
      adminUserRepo.countUsers({ q, role, status }),
    ]);
    return { ok: true, status: 200, data: { rows, total, take, skip } } as const;
  },

  async updateStatus(id: string, body: any) {
    const status = body?.status as UserStatus | undefined;
    if (!status || !["ACTIVE", "SUSPENDED", "BANNED"].includes(status)) {
      return { ok: false, status: 400, message: "status must be ACTIVE|SUSPENDED|BANNED" } as const;
    }
    const row = await adminUserRepo.updateStatus(id, status);
    return { ok: true, status: 200, data: row } as const;
  },
};
