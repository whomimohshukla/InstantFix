import { catalogRepo } from "../repositories/catalog.repo";

export const catalogService = {
  async categories() {
    const cats = await catalogRepo.listCategories();
    return cats.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      serviceCount: c._count.services,
    }));
  },
  async services(categoryId?: string) {
    return catalogRepo.listServicesByCategory(categoryId);
  },
};
