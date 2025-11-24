import { prisma } from "../lib/prisma";

export const addressRepo = {
  listByUser(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: "desc" },
        { id: "desc" },
      ],
    });
  },
  getById(id: string) {
    return prisma.address.findUnique({ where: { id } });
  },
  create(
    userId: string,
    data: {
      label?: string | null;
      line1: string;
      line2?: string | null;
      city: string;
      state: string;
      postalCode: string;
      lat?: number | null;
      lng?: number | null;
      isDefault?: boolean;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }
      return tx.address.create({
        data: {
          userId,
          label: data.label ?? null,
          line1: data.line1,
          line2: data.line2 ?? null,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          lat: data.lat ?? null,
          lng: data.lng ?? null,
          isDefault: Boolean(data.isDefault),
        },
      });
    });
  },
  update(
    userId: string,
    id: string,
    data: Partial<{
      label: string | null;
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postalCode: string;
      lat: number | null;
      lng: number | null;
      isDefault: boolean;
    }>
  ) {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }
      return tx.address.update({ where: { id }, data });
    });
  },
  remove(id: string) {
    return prisma.address.delete({ where: { id } });
  },
};
