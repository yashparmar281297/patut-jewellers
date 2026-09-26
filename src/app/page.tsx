import { createClient } from "@/lib/supabase/server";

async function getSupabaseStatus() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getSession();
  return error ? `Error: ${error.message}` : "Connected";
}

export default async function Home() {
  const status = await getSupabaseStatus();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-stone-50 px-4 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
        Fine Jewellery
      </p>
      <h1 className="text-5xl font-semibold tracking-tight text-stone-900">
        Patut Jewellers
      </h1>
      <p className="max-w-md text-stone-600">
        Timeless gold, diamond and silver pieces, crafted with care.
      </p>
      <span className="rounded-full border border-stone-300 px-3 py-1 text-xs text-stone-500">
        Supabase: {status}
      </span>
    </main>
  );
}
