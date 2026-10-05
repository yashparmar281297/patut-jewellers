import PageHeader from "@/components/admin/PageHeader";
import RatesForm from "@/components/admin/RatesForm";
import { getAdminSession } from "@/lib/admin";
import { getMcxRates } from "@/lib/rates";

export default async function AdminRatesPage() {
  const { supabase } = await getAdminSession();
  const [{ data: settings }, mcx] = await Promise.all([
    supabase.from("gold_rate_settings").select("*").eq("id", 1).maybeSingle(),
    getMcxRates(),
  ]);
  const str = (v: number | null | undefined) => (v ? String(v) : "");

  return (
    <div>
      <PageHeader
        section="Pricing"
        title="Current Day Price"
        subtitle="Set today's 22K and 18K gold rates — every gold product price on the website is calculated from these."
        back={{ href: "/admin", label: "Back to Dashboard" }}
      />
      <RatesForm
        mcxGold10g={mcx ? mcx.gold10g : null}
        lastSaved={settings?.rate_22k_per_10g ? settings.updated_at : null}
        initial={{
          mode: settings?.mode === "live" ? "live" : "manual",
          rate22kPer10g: str(settings?.rate_22k_per_10g),
          rate18kPer10g: str(settings?.rate_18k_per_10g),
          livePremiumPer10g: String(settings?.live_premium_per_10g ?? 0),
        }}
      />
    </div>
  );
}
