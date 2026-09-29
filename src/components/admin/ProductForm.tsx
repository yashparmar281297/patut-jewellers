"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import JewelIcon from "@/components/JewelIcon";
import { deleteProduct, saveProduct, type ProductInput } from "@/app/admin/actions/products";
import { borderFor, Field, inputClass, Toggle } from "@/components/admin/fields";
import {
  categories,
  metals,
  mediaUrl,
  purities,
  slugify,
  type CategorySlug,
  type GoldPurity,
  type MetalSlug,
} from "@/lib/catalog";
import { GOLD_GST_PERCENT, inr, karats, priceBreakup, ratePerGram, type GoldRates } from "@/lib/pricing";
import { useLiveRates } from "@/lib/useLiveRates";
import { uploadImage } from "@/lib/upload";

const MAX_PHOTOS = 12;

export interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  metal: MetalSlug;
  category: CategorySlug;
  purity: (typeof purities)[number];
  weight: string;
  diamondCarat: string;
  makingChargePercent: string;
  goldPurities: GoldPurity[];
  description: string;
  images: string[];
  isNew: boolean;
  isBestseller: boolean;
  isBridal: boolean;
  isPublished: boolean;
  sortOrder: string;
}

interface Photo {
  key: string;
  path?: string;
  preview: string;
  status: "uploading" | "done" | "error";
  error?: string;
}

/** GST, today's Patna rate and the live final price, shown while editing a gold product. */
function LivePricePreview({
  rates,
  secondsAgo,
  weight,
  makingPercent,
  selected,
}: {
  rates: GoldRates | null;
  secondsAgo: number;
  weight: number;
  makingPercent: number;
  selected: GoldPurity[];
}) {
  const shown = karats.filter((k) => selected.includes(k.key));
  return (
    <div className="space-y-3 rounded-2xl border border-gold/25 bg-ivory/60 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-caps text-[10px] tracking-[0.25em] text-muted">GST</span>
        <span className="rounded-full bg-cream px-3 py-1 text-ink">{GOLD_GST_PERCENT}% fixed</span>
      </div>

      <div className="border-t border-gold/15 pt-3">
        <div className="flex items-center justify-between">
          <span className="font-caps text-[10px] tracking-[0.25em] text-muted">Patna Gold Rate · Live</span>
          {rates && (
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="tabular-nums">{secondsAgo}s ago</span>
            </span>
          )}
        </div>
        {rates ? (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {karats.map((k) => (
              <div key={k.key} className="rounded-xl bg-paper px-3 py-2">
                <p className="text-xs text-muted">
                  {k.hallmark} · {k.key}
                </p>
                <p className="font-display text-xl text-ink">
                  {inr.format(ratePerGram(rates, k.key))}
                  <span className="text-xs text-muted"> /g</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-amber-800">
            No rate yet — set today&apos;s rate in{" "}
            <a href="/admin/rates" className="underline">
              Gold Rates
            </a>{" "}
            to see prices.
          </p>
        )}
      </div>

      {rates && shown.length > 0 && weight > 0 && (
        <div className="border-t border-gold/15 pt-3">
          <span className="font-caps text-[10px] tracking-[0.25em] text-muted">Final price (updates live)</span>
          <div className="mt-2 space-y-2">
            {shown.map((k) => {
              const rate = ratePerGram(rates, k.key);
              const p = priceBreakup(rate, weight, makingPercent);
              return (
                <div key={k.key} className="rounded-xl bg-paper px-3 py-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-ink">
                      {k.hallmark} · {k.label}
                    </span>
                    <span className="font-display text-2xl text-ink">{inr.format(p.total)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {weight} g × {inr.format(rate)} = {inr.format(p.goldValue)} + making {makingPercent}% (
                    {inr.format(p.makingCharges)}) + GST {GOLD_GST_PERCENT}% ({inr.format(p.gst)})
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductForm({
  initial,
  initialRates,
}: {
  initial: ProductFormValues;
  initialRates: GoldRates | null;
}) {
  const router = useRouter();
  const { rates: liveRates, secondsAgo } = useLiveRates(initialRates);
  const isEdit = Boolean(initial.id);
  const [values, setValues] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [photos, setPhotos] = useState<Photo[]>(
    initial.images.map((path) => ({ key: path, path, preview: mediaUrl(path), status: "done" })),
  );
  const [dragging, setDragging] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const uploading = photos.some((p) => p.status === "uploading");

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (!slugTouched && (key === "name" || key === "metal")) {
        next.slug = slugify(`${next.metal}-${next.name}`);
      }
      if (key === "metal" && value === "diamond" && prev.purity === "22K") next.purity = "18K";
      if (key === "metal" && value === "gold" && prev.goldPurities.length === 0) next.goldPurities = ["22K"];
      return next;
    });
  }

  async function addFiles(fileList: FileList | File[]) {
    const room = MAX_PHOTOS - photos.length;
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/")).slice(0, Math.max(0, room));
    if (files.length === 0) return;

    const pending: Photo[] = files.map((file) => ({
      key: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
      status: "uploading",
    }));
    setPhotos((prev) => [...prev, ...pending]);

    await Promise.all(
      files.map(async (file, i) => {
        const { key } = pending[i];
        try {
          const path = await uploadImage(file, "products");
          setPhotos((prev) => prev.map((p) => (p.key === key ? { ...p, path, status: "done" } : p)));
        } catch (error) {
          const message = (error as Error).message || "Upload failed";
          setPhotos((prev) => prev.map((p) => (p.key === key ? { ...p, status: "error", error: message } : p)));
        }
      }),
    );
  }

  function movePhoto(index: number, to: number) {
    setPhotos((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function removePhoto(key: string) {
    // Photos already saved on the product are deleted from storage when the product is saved.
    setPhotos((prev) => prev.filter((p) => p.key !== key));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const toNumber = (v: string) => (v.trim() === "" ? Number.NaN : Number(v));
    const input: ProductInput = {
      id: values.id,
      name: values.name,
      slug: values.slug,
      metal: values.metal,
      category: values.category,
      purity: values.purity,
      weight: toNumber(values.weight),
      goldPurities: values.metal === "gold" ? values.goldPurities : [],
      makingChargePercent: values.makingChargePercent.trim() === "" ? 0 : Number(values.makingChargePercent),
      diamondCarat: values.metal === "diamond" && values.diamondCarat.trim() !== "" ? Number(values.diamondCarat) : null,
      description: values.description,
      images: photos.filter((p) => p.status === "done" && p.path).map((p) => p.path!),
      isNew: values.isNew,
      isBestseller: values.isBestseller,
      isBridal: values.isBridal,
      isPublished: values.isPublished,
      sortOrder: values.sortOrder.trim() === "" ? 0 : Number(values.sortOrder),
    };

    startSaving(async () => {
      const result = await saveProduct(input);
      if (!result.ok) {
        setFormError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  }

  function onDelete() {
    if (!values.id) return;
    if (!confirm(`Delete "${values.name}" and its photos? This cannot be undone.`)) return;
    startDeleting(async () => {
      const result = await deleteProduct(values.id!);
      if (!result.ok) {
        setFormError(result.error ?? "Could not delete.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  }

  const border = (key: string) => borderFor(fieldErrors, key);

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      {formError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 lg:col-span-2">{formError}</p>
      )}

      {/* Photos */}
      <section className="rounded-3xl border border-gold/20 bg-paper p-5 sm:p-7">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-ink">Photos</h2>
          <span className="text-xs text-muted">
            {photos.length}/{MAX_PHOTOS} · first photo is the cover
          </span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInput.current?.click()}
          className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragging ? "border-gold bg-cream" : "border-gold/35 hover:border-gold hover:bg-cream/40"
          } ${photos.length >= MAX_PHOTOS ? "pointer-events-none opacity-50" : ""}`}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gold">
            <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
          <p className="mt-3 font-display text-xl text-ink">Drop photos here or tap to choose</p>
          <p className="mt-1 text-xs text-muted">JPG, PNG or WebP · resized automatically for fast loading</p>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {photos.length > 0 && (
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo, i) => (
              <li key={photo.key} className="group relative aspect-square overflow-hidden rounded-xl bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob previews */}
                <img
                  src={photo.preview}
                  alt=""
                  className={`h-full w-full object-cover ${photo.status === "uploading" ? "opacity-50" : ""}`}
                />
                {i === 0 && photo.status === "done" && (
                  <span className="absolute left-2 top-2 rounded-full bg-gold px-2.5 py-1 font-caps text-[9px] tracking-[0.2em] text-paper">
                    Cover
                  </span>
                )}
                {photo.status === "uploading" && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                  </span>
                )}
                {photo.status === "error" && (
                  <span className="absolute inset-x-2 bottom-2 rounded-lg bg-red-600/90 px-2 py-1 text-[11px] text-white">
                    {photo.error}
                  </span>
                )}
                <div className="absolute inset-x-2 bottom-2 flex justify-between gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                  {photo.status === "done" && (
                    <span className="flex gap-1">
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => movePhoto(i, i - 1)}
                        className="rounded-full bg-paper/90 px-2.5 py-1 text-xs text-ink disabled:opacity-30"
                        aria-label="Move left"
                      >
                        ←
                      </button>
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => movePhoto(i, 0)}
                          className="rounded-full bg-paper/90 px-2.5 py-1 text-[11px] text-ink"
                        >
                          Cover
                        </button>
                      )}
                    </span>
                  )}
                  {photo.status !== "uploading" && (
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.key)}
                      className="ml-auto rounded-full bg-paper/90 px-2.5 py-1 text-xs text-red-700"
                      aria-label="Remove photo"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {fieldErrors.images && <p className="mt-3 text-xs text-red-700">{fieldErrors.images}</p>}
      </section>

      {/* Details */}
      <section className="space-y-5 rounded-3xl border border-gold/20 bg-paper p-5 sm:p-7">
        <h2 className="font-display text-2xl text-ink">Details</h2>

        <Field label="Product name" error={fieldErrors.name}>
          <input
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            required
            maxLength={120}
            placeholder="e.g. Rani Haar"
            className={`${inputClass} ${border("name")}`}
          />
        </Field>

        <div>
          <span className="font-caps text-[10px] tracking-[0.25em] text-muted">Metal</span>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {metals.map((m) => (
              <button
                key={m.slug}
                type="button"
                onClick={() => set("metal", m.slug)}
                className={`rounded-xl border px-4 py-3 font-caps text-xs tracking-[0.2em] transition-colors ${
                  values.metal === m.slug ? "border-gold bg-gold text-ivory" : "border-gold/30 text-ink hover:border-gold"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="font-caps text-[10px] tracking-[0.25em] text-muted">Category</span>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => set("category", c.slug)}
                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs transition-colors ${
                  values.category === c.slug ? "border-gold bg-cream text-gold-deep" : "border-gold/25 text-ink hover:border-gold"
                }`}
              >
                <JewelIcon category={c.slug} metal={values.metal} className="h-8 w-8 text-gold" />
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {values.metal === "gold" ? (
          <div>
            <span className="font-caps text-[10px] tracking-[0.25em] text-muted">
              Purity — tick one or both
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {karats.map((k) => {
                const on = values.goldPurities.includes(k.key);
                return (
                  <button
                    key={k.key}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() =>
                      set(
                        "goldPurities",
                        on ? values.goldPurities.filter((p) => p !== k.key) : [...values.goldPurities, k.key],
                      )
                    }
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                      on ? "border-gold bg-gold text-paper" : "border-gold/30 text-ink hover:border-gold"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        on ? "border-paper bg-paper text-gold" : "border-gold/50"
                      }`}
                    >
                      {on && "✓"}
                    </span>
                    <span>
                      <span className="block font-display text-xl leading-none">{k.key}</span>
                      <span className={`text-xs ${on ? "text-paper/80" : "text-muted"}`}>{k.hallmark} hallmark</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {fieldErrors.goldPurities && <p className="mt-1 text-xs text-red-700">{fieldErrors.goldPurities}</p>}
          </div>
        ) : (
          <Field label="Purity" error={fieldErrors.purity}>
            <select
              value={values.purity}
              onChange={(e) => set("purity", e.target.value as ProductFormValues["purity"])}
              className={`${inputClass} ${border("purity")} max-w-40`}
            >
              {purities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Weight (grams)" error={fieldErrors.weight}>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              value={values.weight}
              onChange={(e) => set("weight", e.target.value)}
              required
              className={`${inputClass} ${border("weight")}`}
            />
          </Field>
          <Field label="Making charges (%)" error={fieldErrors.makingChargePercent}>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              max="100"
              value={values.makingChargePercent}
              onChange={(e) => set("makingChargePercent", e.target.value)}
              placeholder="e.g. 12"
              className={`${inputClass} ${border("makingChargePercent")}`}
            />
          </Field>
        </div>

        {values.metal === "gold" && (
          <LivePricePreview
            rates={liveRates}
            secondsAgo={secondsAgo}
            weight={Number(values.weight) || 0}
            makingPercent={Number(values.makingChargePercent) || 0}
            selected={values.goldPurities}
          />
        )}

        {values.metal === "diamond" && (
          <Field label="Diamond weight (carat)" error={fieldErrors.diamondCarat} hint="Total carat weight of all diamonds">
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              value={values.diamondCarat}
              onChange={(e) => set("diamondCarat", e.target.value)}
              className={`${inputClass} ${border("diamondCarat")}`}
            />
          </Field>
        )}

        <Field label="Description" error={fieldErrors.description}>
          <textarea
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Craftsmanship, design details, occasion…"
            className={`${inputClass} ${border("description")} resize-y`}
          />
        </Field>

        <Field
          label="Web address"
          error={fieldErrors.slug}
          hint={`/product/${values.slug || "…"}`}
        >
          <input
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            required
            className={`${inputClass} ${border("slug")} font-mono text-sm`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["isPublished", "Show on website"],
              ["isNew", "New arrival"],
              ["isBestseller", "Bestseller"],
              ["isBridal", "Bridal collection"],
            ] as const
          ).map(([key, label]) => (
            <Toggle key={key} checked={values[key]} onChange={(checked) => set(key, checked)} label={label} />
          ))}
        </div>

        <Field label="Display order" error={fieldErrors.sortOrder} hint="Lower numbers appear first in the collection">
          <input
            type="number"
            min="0"
            step="1"
            value={values.sortOrder}
            onChange={(e) => set("sortOrder", e.target.value)}
            className={`${inputClass} ${border("sortOrder")} max-w-32`}
          />
        </Field>
      </section>

      {/* Actions */}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-gold/20 bg-ivory/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border lg:col-span-2">
        <button
          type="submit"
          disabled={isSaving || uploading || isDeleting}
          className="bg-gold rounded-full px-8 py-3 font-caps text-xs tracking-[0.2em] text-paper disabled:opacity-50"
        >
          {isSaving ? "Saving…" : uploading ? "Uploading photos…" : isEdit ? "Save changes" : "Add product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full px-5 py-3 text-sm text-muted hover:text-ink"
        >
          Cancel
        </button>
        {isEdit && (
          <>
            <a
              href={`/product/${initial.slug}`}
              target="_blank"
              className="text-sm text-gold-deep underline underline-offset-4"
            >
              View on site ↗
            </a>
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting || isSaving}
              className="ml-auto rounded-full border border-red-300 px-5 py-2.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Delete product"}
            </button>
          </>
        )}
      </div>
    </form>
  );
}
