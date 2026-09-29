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

  const updated = settings?.updated_at
    ? new Date(settings.updated_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })
    : null;

  return (
    <div>
      <PageHeader
        section="Gold Rates"
        title="Gold Rates"
        subtitle={`Patna Gold Market rates used for website prices${updated ? ` · last saved ${updated} IST` : ""}`}
        back={{ href: "/admin", label: "Back to Dashboard" }}
      />
      <RatesForm
        mcxGold10g={mcx ? mcx.gold10g : null}
        initial={{
          mode: settings?.mode === "manual" ? "manual" : "live",
          rate22kPer10g: settings?.rate_22k_per_10g ? String(settings.rate_22k_per_10g) : "",
          rate18kPer10g: settings?.rate_18k_per_10g ? String(settings.rate_18k_per_10g) : "",
          livePremiumPer10g: String(settings?.live_premium_per_10g ?? 0),
        }}
      />
    </div>
  );
}
