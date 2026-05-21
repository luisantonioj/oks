"use client";

import dynamic from "next/dynamic";

const AffectedAreasMap = dynamic(
  () => import("@/components/AffectedAreasMap").then((m) => m.AffectedAreasMap),
  { ssr: false }
);

interface Props {
  affectedAreas: string[];
  helpRequests?: { id: string; location: string; status: string }[];
}

export function AffectedAreasMapLoader(props: Props) {
  return <AffectedAreasMap {...props} />;
}
