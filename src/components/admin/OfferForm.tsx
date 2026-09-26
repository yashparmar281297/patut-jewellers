"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteOffer, saveOffer } from "@/app/admin/actions/offers";
import DeleteButton from "@/components/admin/DeleteButton";
import ImageField from "@/components/admin/ImageField";
import { borderFor, Field, FormActions, inputClass, Toggle } from "@/components/admin/fields";

export interface OfferFormValues {
  id?: string;
  title: string;
  description: string;
  badge: string;
  image: string | null;
  validUntil: string;
  isActive: boolean;
  sortOrder: string;
}

export default function OfferForm({ initial }: { initial: OfferFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const border = (key: string) => borderFor(fieldErrors, key);

  function set<K extends keyof OfferFormValues>(key: K, value: OfferFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    startSaving(async () => {
      const result = await saveOffer({
        id: values.id,
        title: values.title,
        description: values.description,
        badge: values.badge,
        image: values.image,
        validUntil: values.validUntil || null,
        isActive: values.isActive,
        sortOrder: values.sortOrder.trim() === "" ? 0 : Number(values.sortOrder),
      });
      if (!result.ok) {
        setFormError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }
      router.push("/admin/offers");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
      {formError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 lg:col-span-2">{formError}</p>}

      <section className="space-y-5 rounded-3xl border border-gold/20 bg-white p-5 sm:p-7">
        <Field label="Offer title" error={fieldErrors.title}>
          <input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            required
            maxLength={120}
            placeholder="e.g. Flat 20% off on making charges"
            className={`${inputClass} ${border("title")}`}
          />
        </Field>
        <Field label="Badge" error={fieldErrors.badge} hint="A short tag shown on the card, e.g. Festive, Limited time">
          <input
            value={values.badge}
            onChange={(e) => set("badge", e.target.value)}
            maxLength={40}
            className={`${inputClass} ${border("badge")}`}
          />
        </Field>
        <Field label="Description" error={fieldErrors.description}>
          <textarea
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            maxLength={600}
            placeholder="What the customer gets and any conditions"
            className={`${inputClass} ${border("description")} resize-y`}
          />
        </Field>
      </section>

      <section className="space-y-5 rounded-3xl border border-gold/20 bg-white p-5 sm:p-7">
        <ImageField
          label="Offer photo (optional)"
          folder="offers"
          value={values.image}
          onChange={(path) => set("image", path)}
          onUploadingChange={setUploading}
          hint="Wide photos look best"
        />
        <Field label="Valid until (optional)" error={fieldErrors.validUntil} hint="The offer hides itself after this date">
          <input
            type="date"
            value={values.validUntil}
            onChange={(e) => set("validUntil", e.target.value)}
            className={`${inputClass} ${border("validUntil")} max-w-56`}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Toggle checked={values.isActive} onChange={(v) => set("isActive", v)} label="Show on website" />
          <Field label="Display order" error={fieldErrors.sortOrder}>
            <input
              type="number"
              min="0"
              step="1"
              value={values.sortOrder}
              onChange={(e) => set("sortOrder", e.target.value)}
              className={`${inputClass} ${border("sortOrder")}`}
            />
          </Field>
        </div>
      </section>

      <FormActions
        saving={isSaving}
        busy={isSaving || uploading}
        saveLabel={uploading ? "Uploading photo…" : values.id ? "Save changes" : "Add offer"}
        onCancel={() => router.push("/admin/offers")}
      >
        {values.id && (
          <span className="ml-auto">
            <DeleteButton id={values.id} name={values.title} action={deleteOffer} redirectTo="/admin/offers" variant="large" />
          </span>
        )}
      </FormActions>
    </form>
  );
}
