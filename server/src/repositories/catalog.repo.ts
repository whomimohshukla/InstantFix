import { prisma } from "../lib/prisma";

export const catalogRepo = {
  listCategories() {
    return prisma.serviceCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { services: true } } },
    });
  },
  listServicesByCategory(categoryId?: string) {
    return prisma.service.findMany({
      where: { isActive: true, ...(categoryId ? { categoryId } : {}) },
      orderBy: { name: "asc" },
    });
  },
  getServiceById(id: string) {
    return prisma.service.findUnique({ where: { id } });
  },
};
