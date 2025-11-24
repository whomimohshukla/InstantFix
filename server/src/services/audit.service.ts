import { prisma } from "../lib/prisma";

export async function logAdminAction(params: {
  actorId: string;
  entityType: string;
  entityId: string;
  action: string;
  diff?: any;
}) {
  try {
    await prisma.adminActionLog.create({
      data: {
        actorId: params.actorId,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        diff: params.diff ?? null,
      },
    });
  } catch {}
}
