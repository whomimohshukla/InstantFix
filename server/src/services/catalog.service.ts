import { catalogRepo } from "../repositories/catalog.repo";
import { prisma } from "../lib/prisma";

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

  async serviceDetail(id: string) {
    const svc = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        bookings: {
          include: { reviews: true },
        },
      },
    });
    if (!svc) return null;

    const allReviews = svc.bookings.flatMap((b) => b.reviews);
    const ratingCount = allReviews.length;
    const ratingAvg =
      ratingCount === 0
        ? 0
        : allReviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount;

    return {
      id: svc.id,
      name: svc.name,
      slug: svc.slug,
      basePrice: svc.basePrice,
      description: svc.description,
      isActive: svc.isActive,
      category: {
        id: svc.category.id,
        name: svc.category.name,
        slug: svc.category.slug,
      },
      ratingAvg,
      ratingCount,
    };
  },
};
