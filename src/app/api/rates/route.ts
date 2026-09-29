import { getGoldRates } from "@/lib/rates";

// Polled by the product page price calculator so prices follow the market without a reload.
export const dynamic = "force-dynamic";

export async function GET() {
  const rates = await getGoldRates();
  return Response.json(
    { rates },
    { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" } },
  );
}
