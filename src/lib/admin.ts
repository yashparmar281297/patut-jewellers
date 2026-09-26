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
