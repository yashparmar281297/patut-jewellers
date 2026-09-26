"use client";

import dynamic from "next/dynamic";

// WebGL only runs in the browser, so the scene is loaded client-side.
const JewelScene = dynamic(() => import("./JewelScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-24 w-24 animate-pulse rounded-full border border-gold/40" />
    </div>
  ),
});

export default function JewelCanvas() {
  return <JewelScene />;
}
