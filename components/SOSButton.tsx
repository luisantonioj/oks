"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

interface SOSButtonProps {
  crisisId?: string;
  variant?: "full" | "compact" | "card";
}

export function SOSButton({ crisisId, variant = "full" }: SOSButtonProps) {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => {
      router.push(
        crisisId
          ? `/stakeholder/help-requests/new?crisis_id=${crisisId}`
          : "/stakeholder/help-requests/new"
      );
    }, 300);
  };

  // ── Card variant: used in the stat cards grid on the dashboard ──
  if (variant === "card") {
    return (
      <button
        onClick={handleClick}
        className={`bg-destructive rounded-2xl cursor-pointer flex flex-col items-center justify-center text-white text-center h-full min-h-[140px] relative overflow-hidden select-none transition-transform w-full ${
          isPressed ? "scale-95" : "active:scale-95"
        }`}
      >
        {/* Pulsing glow rings */}
        <span
          className="absolute rounded-full bg-white/20 pointer-events-none"
          style={{
            width: "90px",
            height: "90px",
            animation: "sos-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite",
          }}
        />
        <span
          className="absolute rounded-full bg-white/10 pointer-events-none"
          style={{
            width: "110px",
            height: "110px",
            animation: "sos-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite 0.4s",
          }}
        />

        {/* Inner circle */}
        <div className="relative z-10 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-red-700 border-4 border-red-400/40 shadow-lg mb-1">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L14 13H2L8 2Z" stroke="white" strokeWidth="1.5" />
            <path d="M8 6v3.5M8 11v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-[11px] font-black tracking-widest leading-none mt-0.5">SOS</p>
        </div>
        <p className="text-[10px] text-white/70 mt-1.5 relative z-10">Tap for help</p>

        {/* Keyframes */}
        <style>{`
          @keyframes sos-ping {
            0%   { transform: scale(0.8); opacity: 0.7; }
            70%  { transform: scale(1.6); opacity: 0;   }
            100% { transform: scale(1.6); opacity: 0;   }
          }
        `}</style>
      </button>
    );
  }

  // ── Compact variant ──
  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm
          bg-red-600 text-white border-2 border-red-700
          hover:bg-red-700 active:scale-95 transition-all duration-150
          shadow-md hover:shadow-red-500/30
          ${isPressed ? "scale-95 opacity-80" : ""}
        `}
      >
        <AlertTriangle className="h-4 w-4" />
        SOS
      </button>
    );
  }

  // ── Full variant (default) ──
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        className={`
          relative w-36 h-36 rounded-full font-black text-2xl tracking-widest uppercase
          bg-red-600 text-white
          border-8 border-red-800
          shadow-[0_0_0_4px_#fca5a5,0_8px_32px_rgba(220,38,38,0.5)]
          hover:shadow-[0_0_0_6px_#fca5a5,0_12px_40px_rgba(220,38,38,0.7)]
          hover:bg-red-700 hover:scale-105
          active:scale-95 active:shadow-[0_0_0_2px_#fca5a5]
          transition-all duration-200 ease-out
          ${isPressed ? "scale-95 bg-red-800" : ""}
        `}
      >
        <span className="relative z-10 flex flex-col items-center gap-1">
          <AlertTriangle className="h-8 w-8" />
          <span>SOS</span>
        </span>
        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
      </button>
      <p className="text-sm text-muted-foreground font-medium">
        Tap to request emergency help
      </p>
    </div>
  );
}