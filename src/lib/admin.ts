import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Returns the signed-in user and a cookie-bound Supabase client.
 * Row-level security still enforces admin rights on every query; this check
 * lets pages and actions fail early with a clear message.
 */
export async function getAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false } as const;

  const { data: isAdmin } = await supabase.rpc("is_admin");
  return { supabase, user, isAdmin: isAdmin === true } as const;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.user || !session.isAdmin) {
    throw new Error("You must be signed in as an admin to do this.");
  }
  return session;
}

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Runs a write as the signed-in admin, turning auth failures into a friendly result. */
export async function withAdmin<T extends ActionResult>(
  run: (supabase: Awaited<ReturnType<typeof createClient>>) => Promise<T>,
): Promise<T | ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    return await run(supabase);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

/** First error message per field from a failed zod parse. */
export function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}
