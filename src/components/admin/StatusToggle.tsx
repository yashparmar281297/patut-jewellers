"use client";

import { useOptimistic, useTransition } from "react";
import type { ActionResult } from "@/lib/admin";

interface Props {
  id: string;
  value: boolean;
  action: (id: string, value: boolean) => Promise<ActionResult>;
  onLabel?: string;
  offLabel?: string;
}

/** Live/Hidden switch that saves immediately. */
export default function StatusToggle({ id, value, action, onLabel = "Live", offLabel = "Hidden" }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(value);

  function toggle() {
    startTransition(async () => {
      setOptimistic(!optimistic);
      const result = await action(id, !optimistic);
      if (!result.ok) alert(result.error);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      onClick={toggle}
      disabled={isPending}
      title={optimistic ? "Visible on the website" : "Hidden from the website"}
      className="flex shrink-0 items-center gap-2 text-xs text-muted"
    >
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${optimistic ? "bg-gold" : "bg-sand"}`}>
        <span
          className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-paper shadow transition-transform ${
            optimistic ? "translate-x-5.5" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="w-12 text-left">{optimistic ? onLabel : offLabel}</span>
    </button>
  );
}
