import { adminCatalogRepo } from "../repositories/adminCatalog.repo";

export const adminCatalogService = {
  // Categories
  async listCategories() {
    const data = await adminCatalogRepo.listCategories();
    return { ok: true, status: 200, data } as const;
  },
  async createCategory(body: any) {
    const { name, slug } = body || {};
    if (!name || !slug) return { ok: false, status: 400, message: "name and slug required" } as const;
    const data = await adminCatalogRepo.createCategory({ name, slug });
    return { ok: true, status: 201, data } as const;
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
    const data = await adminCatalogRepo.createService({ categoryId, name, slug, basePrice, description, isActive });
    return { ok: true, status: 201, data } as const;
  },
  async updateService(id: string, body: any) {
    const data = await adminCatalogRepo.updateService(id, body || {});
    return { ok: true, status: 200, data } as const;
  },
  async deleteService(id: string) {
    await adminCatalogRepo.deleteService(id);
    return { ok: true, status: 200, message: "Deleted" } as const;
  },
};
