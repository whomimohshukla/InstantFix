import { prisma } from "../lib/prisma";

export const profileRepo = {
  getCustomerProfileByUserId(userId: string) {
    return prisma.customerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            name: true,
            role: true,
            status: true,
            emailVerifiedAt: true,
            phoneVerifiedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },

  updateUserName(userId: string, name: string | null) {
    return prisma.user.update({ where: { id: userId }, data: { name } });
  },

  updateCustomerProfile(userId: string, data: Partial<{
    avatarUrl: string | null;
    preferences: any | null;
    defaultAddressId: string | null;
  }>) {
    const updateData: any = {};
    if (Object.prototype.hasOwnProperty.call(data, "avatarUrl")) {
      updateData.avatarUrl = data.avatarUrl ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(data, "preferences")) {
      updateData.preferences = data.preferences ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(data, "defaultAddressId")) {
      updateData.defaultAddressId = data.defaultAddressId ?? null;
    }
    return prisma.customerProfile.update({ where: { userId }, data: updateData });
  },

  getAddressById(id: string) {
    return prisma.address.findUnique({ where: { id } });
  },
};
