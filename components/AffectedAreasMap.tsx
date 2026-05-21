// components/AffectedAreasMap.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Loader2, MapPin } from "lucide-react";

const areaIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f97316" width="32" height="32" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4))">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34],
});

const pendingIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="28" height="28" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4))">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

const resolvedIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#22c55e" width="28" height="28" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4))">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

interface HelpRequestPin {
  id: string;
  location: string;
  status: string;
}

interface GeocodedPoint {
  label: string;
  lat: number;
  lng: number;
}

interface Props {
  affectedAreas: string[];
  helpRequests?: HelpRequestPin[];
}

const COORD_REGEX = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
const PH_CENTER: [number, number] = [12.8797, 121.774];

async function geocode(address: string): Promise<[number, number] | null> {
  const m = address.match(COORD_REGEX);
  if (m) return [parseFloat(m[1]), parseFloat(m[2])];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    if (data?.[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch {
    // skip unresolvable
  }
  return null;
}

export function AffectedAreasMap({ affectedAreas, helpRequests = [] }: Props) {
  const [areaPoints, setAreaPoints] = useState<GeocodedPoint[]>([]);
  const [reqPoints, setReqPoints] = useState<(GeocodedPoint & { status: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function geocodeAll() {
      const areas: GeocodedPoint[] = [];
      for (const area of affectedAreas) {
        const coords = await geocode(area);
        if (coords) areas.push({ label: area, lat: coords[0], lng: coords[1] });
      }

      const reqs: (GeocodedPoint & { status: string })[] = [];
      for (const req of helpRequests) {
        if (!req.location) continue;
        const coords = await geocode(req.location);
        if (coords) reqs.push({ label: req.location, lat: coords[0], lng: coords[1], status: req.status });
      }

      if (!cancelled) {
        setAreaPoints(areas);
        setReqPoints(reqs);
        setLoading(false);
      }
    }

    geocodeAll();
    return () => { cancelled = true; };
  }, [affectedAreas, helpRequests]);

  const allPoints = [...areaPoints, ...reqPoints];
  const center: [number, number] =
    allPoints.length > 0
      ? [
          allPoints.reduce((s, p) => s + p.lat, 0) / allPoints.length,
          allPoints.reduce((s, p) => s + p.lng, 0) / allPoints.length,
        ]
      : PH_CENTER;

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-bold text-foreground mb-3">Affected Areas Map</h2>
        <div className="h-[280px] rounded-lg border border-border flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/30">
          <Loader2 className="h-4 w-4 animate-spin" />
          Geocoding affected areas…
        </div>
      </div>
    );
  }

  if (areaPoints.length === 0 && reqPoints.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-bold text-foreground mb-3">Affected Areas Map</h2>
        <div className="h-[180px] rounded-lg border border-border flex flex-col items-center justify-center gap-1 text-sm text-muted-foreground bg-muted/30">
          <MapPin className="h-5 w-5 opacity-40" />
          <span>No geocodable locations found for this crisis</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-bold text-foreground">Affected Areas Map</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {areaPoints.length} area{areaPoints.length !== 1 ? "s" : ""} · {reqPoints.length} help request{reqPoints.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />Affected area
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" />Pending SOS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />Resolved
          </span>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={center}
          zoom={9}
          style={{ height: "280px", width: "100%" }}
          scrollWheelZoom={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {areaPoints.map((pt, i) => (
            <Marker key={`area-${i}`} position={[pt.lat, pt.lng]} icon={areaIcon}>
              <Popup>{pt.label}</Popup>
            </Marker>
          ))}
          {reqPoints.map((pt, i) => (
            <Marker
              key={`req-${i}`}
              position={[pt.lat, pt.lng]}
              icon={pt.status === "pending" ? pendingIcon : resolvedIcon}
            >
              <Popup>
                <span className="capitalize font-semibold">{pt.status}</span>
                {pt.label && ` — ${pt.label}`}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
