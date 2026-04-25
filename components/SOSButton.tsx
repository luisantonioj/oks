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