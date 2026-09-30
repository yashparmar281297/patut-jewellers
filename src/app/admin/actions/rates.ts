"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fieldErrorsFrom, withAdmin, type ActionResult } from "@/lib/admin";

const rateSchema = z
  .object({
    mode: z.enum(["live", "manual"]),
    rate22kPer10g: z.number().positive("Enter the 22K rate").max(10_000_000).nullable(),
    rate18kPer10g: z.number().positive("Enter the 18K rate").max(10_000_000).nullable(),
    diamondRatePerCarat: z.number().positive("Enter the diamond rate").max(100_000_000).nullable(),
    livePremiumPer10g: z.number().min(-1_000_000).max(1_000_000),
  })
  .refine((v) => v.mode === "live" || (v.rate22kPer10g !== null && v.rate18kPer10g !== null), {
    message: "Enter both 22K and 18K rates",
    path: ["rate22kPer10g"],
  });

export type RateSettingsInput = z.input<typeof rateSchema>;

export async function saveRateSettings(input: RateSettingsInput): Promise<ActionResult> {
  const parsed = rateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const r = parsed.data;
  return withAdmin(async (supabase) => {
    const { error } = await supabase
      .from("gold_rate_settings")
      .update({
        mode: r.mode,
        rate_22k_per_10g: r.rate22kPer10g,
        rate_18k_per_10g: r.rate18kPer10g,
        diamond_rate_per_carat: r.diamondRatePerCarat,
        live_premium_per_10g: r.livePremiumPer10g,
      })
      .eq("id", 1);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  });
}
