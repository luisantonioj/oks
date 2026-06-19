// lib/geocoding.ts

const COORD_REGEX = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;

// Campus and Lipa City Preset coordinates to prevent Nominatim rate-limiting and offline issues
const PRESETS: Record<string, [number, number]> = {
  "de la salle lipa": [13.9312, 121.1578],
  "dlsl": [13.9312, 121.1578],
  "dlsl campus": [13.9312, 121.1578],
  "college building": [13.9315, 121.1575],
  "gymnasium": [13.9310, 121.1580],
  "sentinel": [13.9310, 121.1580],
  "sentinel sports arena": [13.9310, 121.1580],
  "ictc": [13.9316, 121.1576],
  "mabangulo": [13.9298, 121.1540],
  "lipa": [13.9413, 121.1624],
  "lipa city": [13.9413, 121.1624],
  "lipa city, batangas": [13.9413, 121.1624],
  "mataas na lupa": [13.9367, 121.1610],
  "marawoy": [13.9575, 121.1612],
  "tambobong": [13.9372, 121.1420],
  "sabang": [13.9272, 121.1645],
};

// Simple in-memory cache for the session lifetime
const geocodeCache: Map<string, [number, number] | null> = new Map();

// Helper to add a delay between requests to Nominatim (strict 1 request/second)
let lastRequestTime = 0;
async function throttle() {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - timeSinceLast));
  }
  lastRequestTime = Date.now();
}

/**
 * Resolves an address string into latitude and longitude coordinates.
 * Utilizes coordinate regex, campus/local presets, in-memory caching,
 * and rate-limited Nominatim geocoding as a fallback.
 */
export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  if (!address) return null;

  const normalized = address.trim().toLowerCase();

  // 1. Check if the address is already a coordinate string (e.g., "13.9312, 121.1578")
  const match = address.match(COORD_REGEX);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2])];
  }

  // 2. Check if the address matches one of our local campus presets
  for (const presetKey of Object.keys(PRESETS)) {
    if (normalized.includes(presetKey)) {
      console.log(`[Geocoding] Resolved "${address}" from DLSL presets.`);
      return PRESETS[presetKey];
    }
  }

  // 3. Check cache
  if (geocodeCache.has(normalized)) {
    return geocodeCache.get(normalized) ?? null;
  }

  // 4. Fallback: Query Nominatim with rate limiting
  await throttle();
  try {
    console.log(`[Geocoding] Fetching coordinates for "${address}" from Nominatim...`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    if (data?.[0]) {
      const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      geocodeCache.set(normalized, coords);
      return coords;
    }
  } catch (error) {
    console.error(`[Geocoding] Failed to resolve address "${address}":`, error);
  }

  // Cache failures to prevent repeated API calls
  geocodeCache.set(normalized, null);
  return null;
}
