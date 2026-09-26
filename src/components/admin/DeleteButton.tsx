"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ActionResult } from "@/lib/admin";

interface Props {
  id: string;
  name: string;
  action: (id: string) => Promise<ActionResult>;
  /** Where to go after deleting; omit to stay and refresh the list. */
  redirectTo?: string;
  variant?: "small" | "large";
}

export default function DeleteButton({ id, name, action, redirectTo, variant = "small" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onClick() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await action(id);
      if (!result.ok) {
        alert(result.error);
        return;
      }
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={
        variant === "large"
          ? "ml-auto rounded-full border border-red-300 px-5 py-2.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
          : "inline-flex h-8 items-center justify-center rounded-lg border border-red-200 px-3 text-xs font-medium text-red-700 transition hover:border-red-500 hover:bg-red-600 hover:text-white disabled:opacity-50"
      }
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
