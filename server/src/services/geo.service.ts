const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
const COUNTRY = process.env.OPENCAGE_COUNTRY; // e.g., IN
const LANGUAGE = process.env.OPENCAGE_LANGUAGE; // e.g., en
const BOUNDS = process.env.OPENCAGE_BOUNDS; // south,west,north,east

function buildParams() {
  const p: string[] = ["limit=1", "no_annotations=1"];
  if (COUNTRY)
    p.push(`countrycode=${encodeURIComponent(COUNTRY.toLowerCase())}`);
  if (LANGUAGE) p.push(`language=${encodeURIComponent(LANGUAGE)}`);
  if (BOUNDS) p.push(`bounds=${encodeURIComponent(BOUNDS)}`);
  return p.join("&");
}

export type GeocodeResult = {
  lat: number;
  lng: number;
  formatted?: string;
  city?: string;
  state?: string;
  country?: string;
};

export const geoService = {
  async geocodeAddress(q: string): Promise<GeocodeResult | null> {
    if (!q?.trim() || !OPENCAGE_API_KEY) return null;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      q
    )}&key=${OPENCAGE_API_KEY}&${buildParams()}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const json: any = await resp.json();
    const item = json?.results?.[0];
    if (!item) return null;
    const lat = item.geometry?.lat;
    const lng = item.geometry?.lng;
    const city =
      item.components?.city ||
      item.components?.town ||
      item.components?.village;
    const state = item.components?.state;
    const country = item.components?.country;
    return { lat, lng, formatted: item.formatted, city, state, country };
  },

  async reverseGeocode(
    lat: number,
    lng: number
  ): Promise<GeocodeResult | null> {
    if (typeof lat !== "number" || typeof lng !== "number" || !OPENCAGE_API_KEY)
      return null;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}&${buildParams()}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const json: any = await resp.json();
    const item = json?.results?.[0];
    if (!item) return null;
    const city =
      item.components?.city ||
      item.components?.town ||
      item.components?.village;
    const state = item.components?.state;
    const country = item.components?.country;
    return { lat, lng, formatted: item.formatted, city, state, country };
  },
};
