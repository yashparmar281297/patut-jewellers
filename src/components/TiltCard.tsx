"use client";

import { useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  max?: number;
}

/** Card that tilts in 3D toward the pointer, with a moving highlight. */
export default function TiltCard({ children, className = "", max = 10 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node || event.pointerType === "touch") return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    node.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
    node.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
    node.style.setProperty("--gx", `${px * 100}%`);
    node.style.setProperty("--gy", `${py * 100}%`);
  }

  function onLeave() {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
  }

  return (
    <div className="[perspective:1000px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`relative transition-transform duration-500 ease-[var(--ease-luxe)] [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] ${className}`}
      >
        {children}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgba(255,240,205,0.45),transparent_55%)] group-hover:opacity-100" />
      </div>
    </div>
  );
}
