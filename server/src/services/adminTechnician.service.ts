import { adminTechnicianRepo } from "../repositories/adminTechnician.repo";
import { VerificationStatus } from "@prisma/client";

export const adminTechnicianService = {
  async listVerificationRequests(query: any) {
    const status = (query?.status as VerificationStatus | undefined) || undefined;
    const take = Math.min(parseInt(query?.limit || "20", 10) || 20, 100);
    const skip = parseInt(query?.skip || "0", 10) || 0;
    const data = await adminTechnicianRepo.listVerificationRequests(status, take, skip);
    return { ok: true, status: 200, data } as const;
  },

  async getVerificationRequest(id: string) {
    const row = await adminTechnicianRepo.getVerificationRequestById(id);
    if (!row) return { ok: false, status: 404, message: "Not found" } as const;
    return { ok: true, status: 200, data: row } as const;
  },

  async reviewVerificationRequest(id: string, reviewerId: string, body: any) {
    const { action, notes } = body || {};
    if (!action || !["APPROVE", "REJECT"].includes(action))
      return { ok: false, status: 400, message: "action must be APPROVE or REJECT" } as const;

    const status = action === "APPROVE" ? VerificationStatus.APPROVED : VerificationStatus.REJECTED;
    const updated = await adminTechnicianRepo.updateVerificationRequestStatus(id, status, reviewerId, notes ?? null);
    return { ok: true, status: 200, data: updated } as const;
  },
};
