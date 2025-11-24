import { prisma } from "../lib/prisma";

export const adminCatalogRepo = {
  // Categories
  listCategories() {
    return prisma.serviceCategory.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { services: true } } },
    });
  },
  getCategoryById(id: string) {
    return prisma.serviceCategory.findUnique({ where: { id } });
  },
  createCategory(data: { name: string; slug: string }) {
    return prisma.serviceCategory.create({ data });
  },
  updateCategory(id: string, data: Partial<{ name: string; slug: string }>) {
    return prisma.serviceCategory.update({ where: { id }, data });
  },
  deleteCategory(id: string) {
    return prisma.serviceCategory.delete({ where: { id } });
  },

  // Services
  listServices(categoryId?: string) {
    return prisma.service.findMany({
      where: { ...(categoryId ? { categoryId } : {}) },
      orderBy: { createdAt: "desc" },
    });
  },
  getServiceById(id: string) {
    return prisma.service.findUnique({ where: { id } });
  },
  createService(data: {
    categoryId: string;
    name: string;
    slug: string;
    basePrice: number;
    description?: string | null;
    isActive?: boolean;
  }) {
    return prisma.service.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        slug: data.slug,
        basePrice: data.basePrice,
        description: data.description ?? null,
        isActive: data.isActive ?? true,
      },
    });
  },
  updateService(id: string, data: Partial<{ name: string; slug: string; basePrice: number; description: string | null; isActive: boolean; categoryId: string }>) {
    return prisma.service.update({ where: { id }, data });
  },
  deleteService(id: string) {
    return prisma.service.delete({ where: { id } });
  },
};
