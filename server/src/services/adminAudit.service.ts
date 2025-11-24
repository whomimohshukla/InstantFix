import { adminAuditRepo } from "../repositories/adminAudit.repo";

function parseDate(input?: string): Date | null {
  if (!input) return null;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

export const adminAuditService = {
  async list(query: any) {
    const take = Math.min(parseInt(query?.limit || "20", 10) || 20, 100);
    const skip = parseInt(query?.skip || "0", 10) || 0;
    const actorId = (query?.actorId as string | undefined) || undefined;
    const entityType = (query?.entityType as string | undefined) || undefined;
    const action = (query?.action as string | undefined) || undefined;
    const from = parseDate(query?.from as string | undefined);
    const to = parseDate(query?.to as string | undefined);

    const [rows, total] = await Promise.all([
      adminAuditRepo.list({ actorId, entityType, action, from, to, take, skip }),
      adminAuditRepo.count({ actorId, entityType, action, from, to }),
    ]);
    return { ok: true, status: 200, data: { rows, total, take, skip } } as const;
  },
};
