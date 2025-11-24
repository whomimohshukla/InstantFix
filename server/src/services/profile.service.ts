import { profileRepo } from "../repositories/profile.repo";

export const profileService = {
  async getMyProfile(userId: string) {
    const prof = await profileRepo.getCustomerProfileByUserId(userId);
    if (!prof) return { ok: false, status: 404, message: "Profile not found" };
    return { ok: true, status: 200, data: prof };
  },

  async updateMyProfile(userId: string, body: any) {
    const { name, avatarUrl, preferences, defaultAddressId } = body || {};

    if (typeof name !== "undefined") {
      if (typeof name !== "string" && name !== null)
        return { ok: false, status: 400, message: "name must be string or null" };
      await profileRepo.updateUserName(userId, name ?? null);
    }

    const toUpdate: any = {};
    if (typeof avatarUrl !== "undefined") {
      if (avatarUrl !== null && typeof avatarUrl !== "string")
        return { ok: false, status: 400, message: "avatarUrl must be string or null" };
      toUpdate.avatarUrl = avatarUrl ?? null;
    }

    if (typeof preferences !== "undefined") {
      // allow any JSON-serializable
      toUpdate.preferences = preferences ?? null;
    }

    if (typeof defaultAddressId !== "undefined") {
      if (defaultAddressId !== null && typeof defaultAddressId !== "string")
        return { ok: false, status: 400, message: "defaultAddressId must be string or null" };
      if (defaultAddressId) {
        const addr = await profileRepo.getAddressById(defaultAddressId);
        if (!addr || addr.userId !== userId) {
          return { ok: false, status: 400, message: "Invalid defaultAddressId" };
        }
      }
      toUpdate.defaultAddressId = defaultAddressId ?? null;
    }

    if (Object.keys(toUpdate).length) {
      await profileRepo.updateCustomerProfile(userId, toUpdate);
    }

    const updated = await profileRepo.getCustomerProfileByUserId(userId);
    return { ok: true, status: 200, data: updated };
  },
};
