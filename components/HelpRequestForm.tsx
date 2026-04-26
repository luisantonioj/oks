//components/HelpRequestForm.tsx
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createHelpRequest } from "@/app/actions/help-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, MapPin, FileText, Loader2, LocateFixed } from "lucide-react";
import { Crisis } from "@/types/database";

interface HelpRequestFormProps {
  crises: Crisis[];
  defaultCrisisId?: string;
}

export function HelpRequestForm({ crises, defaultCrisisId }: HelpRequestFormProps) {
  const [state, formAction, isPending] = useActionState(createHelpRequest, null);
  const [location, setLocation] = useState("");
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const hasAutoLocated = useRef(false);

  useEffect(() => {
    if (hasAutoLocated.current) return;
    hasAutoLocated.current = true;
    detectLocation();
  }, []);

  function detectLocation() {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported on this device.");
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address = data.display_name ?? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setLocation(address);
        } catch {
          setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocError("Location access denied. Please enter your location manually.");
        } else {
          setLocError("Could not detect location. Please enter it manually.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  const singleCrisis = crises.length === 1 ? crises[0] : null;
  const multipleCrises = crises.length > 1;

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Help Request Submitted</h3>
        <p className="text-muted-foreground max-w-sm">
          Your emergency request has been received. Our team will respond as soon as possible.
        </p>
        <a href="/stakeholder/help-requests" className="text-sm underline text-primary">
          View my requests
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">

      {/* ── Crisis field ── */}
      {singleCrisis ? (
        <>
          <input type="hidden" name="crisis_id" value={singleCrisis.id} />
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Related Crisis
            </Label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-muted/40 text-sm">
              <span className="text-[10px] font-bold bg-destructive/15 text-destructive px-1.5 py-0.5 rounded uppercase">
                {singleCrisis.severity}
              </span>
              <span className="font-medium">{singleCrisis.type}</span>
              <span className="text-muted-foreground">— {singleCrisis.affected_areas}</span>
            </div>
          </div>
        </>
      ) : multipleCrises ? (
        <div className="space-y-2">
          <Label htmlFor="crisis_id" className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Related Crisis *
          </Label>
          <select
            id="crisis_id"
            name="crisis_id"
            required
            defaultValue={defaultCrisisId || ""}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="" disabled>Select a crisis...</option>
            {crises.map((crisis) => (
              <option key={crisis.id} value={crisis.id}>
                [{crisis.severity.toUpperCase()}] {crisis.type} — {crisis.affected_areas}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {/* ── Location field ── */}
      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2 text-sm font-semibold">
          <MapPin className="h-4 w-4 text-blue-500" />
          Your Current Location *
        </Label>
        <div className="flex gap-2">
          <Input
            id="location"
            name="location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={locating ? "Detecting your location…" : "e.g., Building A, Room 201..."}
            className="h-10 flex-1"
            disabled={locating}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 flex-shrink-0"
            onClick={detectLocation}
            disabled={locating}
            title="Detect my location"
          >
            {locating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
          </Button>
        </div>
        {locError ? (
          <p className="text-xs text-destructive">{locError}</p>
        ) : locating ? (
          <p className="text-xs text-muted-foreground">Detecting your location…</p>
        ) : location ? (
          <p className="text-xs text-muted-foreground">Location detected. You can edit it if needed.</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Be as specific as possible so responders can find you quickly.
          </p>
        )}
      </div>

      {/* ── Notes field ── */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4 text-purple-500" />
          Additional Notes
        </Label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Describe your situation, number of people, medical needs, etc..."
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      {state?.error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending || locating}
        className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-base gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting Request...
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4" />
            Submit Emergency Request
          </>
        )}
      </Button>
    </form>
  );
}