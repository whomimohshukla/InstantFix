import { prisma } from "../lib/prisma";

export const adminAuditRepo = {
  list(params: {
    actorId?: string;
    entityType?: string;
    action?: string;
    from?: Date | null;
    to?: Date | null;
    take: number;
    skip: number;
  }) {
    const { actorId, entityType, action, from, to, take, skip } = params;
    const where: any = {};
    if (actorId) where.actorId = actorId;
    if (entityType) where.entityType = entityType;
    if (action) where.action = action;
    if (from || to) where.createdAt = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };

    return prisma.adminActionLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });
  },
  count(params: { actorId?: string; entityType?: string; action?: string; from?: Date | null; to?: Date | null }) {
    const { actorId, entityType, action, from, to } = params;
    const where: any = {};
    if (actorId) where.actorId = actorId;
    if (entityType) where.entityType = entityType;
    if (action) where.action = action;
    if (from || to) where.createdAt = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };
    return prisma.adminActionLog.count({ where });
  },
};
