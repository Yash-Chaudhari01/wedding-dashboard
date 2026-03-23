"use client";

import dynamic from "next/dynamic";

const NavigationMap = dynamic(() => import("./NavigationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-primary-light/20 animate-pulse rounded-2xl border border-primary-light flex items-center justify-center text-primary-dark">
      Loading Mapping Engine...
    </div>
  ),
});

export default function NavigationMapWrapper({
  venueLat,
  venueLng,
  venueName,
}: {
  venueLat: number;
  venueLng: number;
  venueName: string;
}) {
  return (
    <NavigationMap
      venueLat={venueLat}
      venueLng={venueLng}
      venueName={venueName}
    />
  );
}
