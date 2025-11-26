import { adminCatalogRepo } from "../repositories/adminCatalog.repo";
import { prisma } from "../lib/prisma";

export const adminCatalogService = {
  // Categories
  async listCategories() {
    const data = await adminCatalogRepo.listCategories();
    return { ok: true, status: 200, data } as const;
  },
  async createCategory(body: any) {
    const { name, slug } = body || {};
    if (!name || !slug) return { ok: false, status: 400, message: "name and slug required" } as const;
    try {
      const data = await adminCatalogRepo.createCategory({ name, slug });
      return { ok: true, status: 201, data } as const;
    } catch (e: any) {
      if (e?.code === "P2002") {
        // Any unique constraint violation here is effectively a slug conflict
        return { ok: false, status: 409, message: "Category slug already exists" } as const;
      }
      throw e;
    }
  },
  async updateCategory(id: string, body: any) {
    const { name, slug } = body || {};
    const data = await adminCatalogRepo.updateCategory(id, { name, slug });
    return { ok: true, status: 200, data } as const;
  },
  async deleteCategory(id: string) {
    await adminCatalogRepo.deleteCategory(id);
    return { ok: true, status: 200, message: "Deleted" } as const;
  },

  // Services
  async listServices(query: any) {
    const { categoryId } = query || {};
    const data = await adminCatalogRepo.listServices(categoryId);
    return { ok: true, status: 200, data } as const;
  },
  async createService(body: any) {
    const { categoryId, name, slug, basePrice, description, isActive } = body || {};
    if (!categoryId || !name || !slug || typeof basePrice !== "number")
      return { ok: false, status: 400, message: "categoryId, name, slug, basePrice required" } as const;
    try {
      const data = await adminCatalogRepo.createService({ categoryId, name, slug, basePrice, description, isActive });
      return { ok: true, status: 201, data } as const;
    } catch (e: any) {
      if (e?.code === "P2002") {
        // Any unique constraint violation here is effectively a slug conflict
        return { ok: false, status: 409, message: "Service slug already exists" } as const;
      }
      throw e;
    }
  },
  async updateService(id: string, body: any) {
    const data = await adminCatalogRepo.updateService(id, body || {});
    return { ok: true, status: 200, data } as const;
  },
  async deleteService(id: string) {
    await adminCatalogRepo.deleteService(id);
    return { ok: true, status: 200, message: "Deleted" } as const;
  },

  // Service Media (images, videos, etc.)
  async addServiceMedia(serviceId: string, body: any) {
    const { url, publicId, type, title } = body || {};
    if (!url) return { ok: false, status: 400, message: "url required" } as const;

    // Ensure service exists
    const svc = await adminCatalogRepo.updateService(serviceId, {});
    if (!svc) return { ok: false, status: 404, message: "Service not found" } as const;

    const media = await prisma.media.create({
      data: {
        ownerType: "SERVICE",
        ownerId: serviceId,
        url,
        publicId,
        type: type || "IMAGE",
        title,
      },
    });

    return { ok: true, status: 201, data: media } as const;
  },

  async deleteServiceMedia(serviceId: string, mediaId: string) {
    // Delete only if it belongs to this service
    const deleted = await prisma.media.deleteMany({
      where: {
        id: mediaId,
        ownerType: "SERVICE",
        ownerId: serviceId,
      },
    });
    if (deleted.count === 0)
      return { ok: false, status: 404, message: "Media not found" } as const;
    return { ok: true, status: 200, message: "Deleted" } as const;
  },
};
