//components/RequestLocationMap.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { Loader2, MapPin } from "lucide-react";

const pinIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="32" height="32" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4))">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface Props {
  address: string;
}

export function RequestLocationMap({ address }: Props) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!address) { setLoading(false); return; }

    // Check if address is raw coordinates
    const coordMatch = address.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);
    if (coordMatch) {
      setCoords([parseFloat(coordMatch[1]), parseFloat(coordMatch[2])]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.[0]) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setFailed(true);
        }
      })
      .catch(() => { if (!cancelled) setFailed(true); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [address]);

  if (loading) {
    return (
      <div className="h-[180px] rounded-md border border-input flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/30">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading map…
      </div>
    );
  }

  if (failed || !coords) {
    return (
      <div className="h-[180px] rounded-md border border-input flex flex-col items-center justify-center gap-1 text-sm text-muted-foreground bg-muted/30">
        <MapPin className="h-5 w-5 opacity-40" />
        <span>Map unavailable for this address</span>
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden border border-input">
      <MapContainer
        center={coords}
        zoom={15}
        style={{ height: "180px", width: "100%" }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={coords} icon={pinIcon} />
      </MapContainer>
    </div>
  );
}
