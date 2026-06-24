"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ModalShellProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  zIndexClassName?: string;
}

export function ModalShell({
  children,
  className,
  contentClassName,
  zIndexClassName = "z-50",
}: ModalShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:items-center",
        zIndexClassName,
        className
      )}
    >
      <div className={cn("my-auto w-full", contentClassName)}>{children}</div>
    </div>,
    document.body
  );
}
