//components/LocationPickerMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Loader2 } from "lucide-react";

const pinIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="36" height="36" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4))">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

interface Props {
  lat: number | null;
  lng: number | null;
  onPick: (lat: number, lng: number, address: string) => void;
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const DEFAULT_CENTER: [number, number] = [12.8797, 121.774]; // Philippines center
const DEFAULT_ZOOM = 6;
const PICKED_ZOOM = 15;

export function LocationPickerMap({ lat, lng, onPick }: Props) {
  const [geocoding, setGeocoding] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (lat !== null && lng !== null && mapRef.current) {
      mapRef.current.flyTo([lat, lng], PICKED_ZOOM, { duration: 1 });
    }
  }, [lat, lng]);

  async function handleMapClick(clickLat: number, clickLng: number) {
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${clickLat}&lon=${clickLng}&format=json`
      );
      const data = await res.json();
      const address = data.display_name ?? `${clickLat.toFixed(5)}, ${clickLng.toFixed(5)}`;
      onPick(clickLat, clickLng, address);
    } catch {
      onPick(clickLat, clickLng, `${clickLat.toFixed(5)}, ${clickLng.toFixed(5)}`);
    } finally {
      setGeocoding(false);
    }
  }

  return (
    <div className="relative rounded-md overflow-hidden border border-input">
      <MapContainer
        center={lat !== null && lng !== null ? [lat, lng] : DEFAULT_CENTER}
        zoom={lat !== null && lng !== null ? PICKED_ZOOM : DEFAULT_ZOOM}
        style={{ height: "260px", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={handleMapClick} />
        {lat !== null && lng !== null && (
          <Marker position={[lat, lng]} icon={pinIcon} />
        )}
      </MapContainer>

      {geocoding && (
        <div className="absolute inset-0 bg-background/60 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 text-sm bg-background border rounded-md px-3 py-1.5 shadow">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Getting address…
          </div>
        </div>
      )}

      <p className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[11px] bg-background/80 px-2 py-0.5 rounded pointer-events-none select-none z-[1000]">
        Tap the map to set your location
      </p>
    </div>
  );
}
