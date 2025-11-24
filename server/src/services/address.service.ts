import { addressRepo } from "../repositories/address.repo";
import { geoService } from "./geo.service";

function asLine({ line1, line2, city, state, postalCode }: any) {
  return [line1, line2, city, state, postalCode].filter(Boolean).join(", ");
}

export const addressService = {
  list(userId: string) {
    return addressRepo.listByUser(userId);
  },
  async create(userId: string, body: any) {
    const {
      label,
      line1,
      line2,
      city,
      state,
      postalCode,
      lat,
      lng,
      isDefault,
    } = body || {};
    if (!line1 || !city || !state || !postalCode) {
      return {
        ok: false,
        status: 400,
        message: "line1, city, state, postalCode required",
      };
    }
    let latOut = lat ?? null;
    let lngOut = lng ?? null;
    let cityOut = city ?? null;
    let stateOut = state ?? null;

    // If no coords but we have textual address, attempt geocode (when API key present)
    if ((latOut === null || lngOut === null) && process.env.OPENCAGE_API_KEY) {
      const q = asLine({ line1, line2, city, state, postalCode });
      const geo = await geoService.geocodeAddress(q);
      if (geo) {
        latOut = geo.lat;
        lngOut = geo.lng;
        cityOut = cityOut || geo.city || cityOut;
        stateOut = stateOut || geo.state || stateOut;
      }
    }

    // If coords provided (or obtained) but city/state missing, reverse geocode
    if ((cityOut === null || stateOut === null) && latOut !== null && lngOut !== null && process.env.OPENCAGE_API_KEY) {
      const rev = await geoService.reverseGeocode(latOut, lngOut);
      if (rev) {
        cityOut = cityOut || rev.city || cityOut;
        stateOut = stateOut || rev.state || stateOut;
      }
    }

    const created = await addressRepo.create(userId, {
      label,
      line1,
      line2,
      city: cityOut || city,
      state: stateOut || state,
      postalCode,
      lat: latOut,
      lng: lngOut,
      isDefault,
    });
    return { ok: true, status: 201, data: created };
  },
  async update(userId: string, id: string, body: any) {
    const addr = await addressRepo.getById(id);
    if (!addr || addr.userId !== userId)
      return { ok: false, status: 403, message: "Forbidden" };
    let {
      label, line1, line2, city, state, postalCode, lat, lng, isDefault,
    } = body || {};

    // merge with current values for geocoding completeness
    line1 = line1 ?? addr.line1;
    line2 = line2 ?? addr.line2;
    city = city ?? addr.city;
    state = state ?? addr.state;
    postalCode = postalCode ?? addr.postalCode;
    let latOut = (lat ?? addr.lat) ?? null;
    let lngOut = (lng ?? addr.lng) ?? null;

    if ((latOut === null || lngOut === null) && process.env.OPENCAGE_API_KEY) {
      const q = asLine({ line1, line2, city, state, postalCode });
      const geo = await geoService.geocodeAddress(q);
      if (geo) {
        latOut = geo.lat;
        lngOut = geo.lng;
        city = city || geo.city || city;
        state = state || geo.state || state;
      }
    }

    if ((city == null || state == null) && latOut !== null && lngOut !== null && process.env.OPENCAGE_API_KEY) {
      const rev = await geoService.reverseGeocode(latOut, lngOut);
      if (rev) {
        city = city || rev.city || city;
        state = state || rev.state || state;
      }
    }

    const updated = await addressRepo.update(userId, id, {
      label: label ?? addr.label,
      line1,
      line2,
      city,
      state,
      postalCode,
      lat: latOut,
      lng: lngOut,
      isDefault,
    });
    return { ok: true, status: 200, data: updated };
  },
  async remove(userId: string, id: string) {
    const addr = await addressRepo.getById(id);
    if (!addr || addr.userId !== userId)
      return { ok: false, status: 403, message: "Forbidden" };
    await addressRepo.remove(id);
    return { ok: true, status: 200, message: "Deleted" };
  },
};
