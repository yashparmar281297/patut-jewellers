import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only the admin area uses sign-in sessions; storefront pages stay cacheable.
export const config = {
  matcher: ["/admin/:path*"],
};
