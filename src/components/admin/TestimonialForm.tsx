"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTestimonial, saveTestimonial } from "@/app/admin/actions/testimonials";
import DeleteButton from "@/components/admin/DeleteButton";
import ImageField from "@/components/admin/ImageField";
import { borderFor, Field, FormActions, inputClass, Toggle } from "@/components/admin/fields";

export interface TestimonialFormValues {
  id?: string;
  customerName: string;
  location: string;
  rating: number;
  message: string;
  photo: string | null;
  isPublished: boolean;
  sortOrder: string;
}

export default function TestimonialForm({ initial }: { initial: TestimonialFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const border = (key: string) => borderFor(fieldErrors, key);

  function set<K extends keyof TestimonialFormValues>(key: K, value: TestimonialFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    startSaving(async () => {
      const result = await saveTestimonial({
        id: values.id,
        customerName: values.customerName,
        location: values.location,
        rating: values.rating,
        message: values.message,
        photo: values.photo,
        isPublished: values.isPublished,
        sortOrder: values.sortOrder.trim() === "" ? 0 : Number(values.sortOrder),
      });
      if (!result.ok) {
        setFormError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }
      router.push("/admin/testimonials");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
      {formError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 lg:col-span-2">{formError}</p>}

      <section className="space-y-5 rounded-3xl border border-gold/20 bg-paper p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Customer name" error={fieldErrors.customerName}>
            <input
              value={values.customerName}
              onChange={(e) => set("customerName", e.target.value)}
              required
              maxLength={80}
              className={`${inputClass} ${border("customerName")}`}
            />
          </Field>
          <Field label="City (optional)" error={fieldErrors.location}>
            <input
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
              maxLength={80}
              className={`${inputClass} ${border("location")}`}
            />
          </Field>
        </div>

        <div>
          <span className="font-caps text-[10px] tracking-[0.25em] text-muted">Rating</span>
          <div className="mt-1.5 flex gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={values.rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => set("rating", n)}
                className="p-0.5"
              >
                <svg viewBox="0 0 20 20" className={`h-8 w-8 ${n <= values.rating ? "text-gold" : "text-sand"}`} fill="currentColor">
                  <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <Field label="Customer feedback" error={fieldErrors.message}>
          <textarea
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            required
            rows={6}
            maxLength={1000}
            placeholder="What the customer said about their experience"
            className={`${inputClass} ${border("message")} resize-y`}
          />
        </Field>
      </section>

      <section className="space-y-5 rounded-3xl border border-gold/20 bg-paper p-5 sm:p-7">
        <ImageField
          label="Customer photo (optional)"
          folder="testimonials"
          value={values.photo}
          onChange={(path) => set("photo", path)}
          onUploadingChange={setUploading}
          hint="Only with the customer's permission"
          round
        />
        <div className="grid grid-cols-2 gap-3">
          <Toggle checked={values.isPublished} onChange={(v) => set("isPublished", v)} label="Show on website" />
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
        saveLabel={uploading ? "Uploading photo…" : values.id ? "Save changes" : "Add testimonial"}
        onCancel={() => router.push("/admin/testimonials")}
      >
        {values.id && (
          <span className="ml-auto">
            <DeleteButton
              id={values.id}
              name={`${values.customerName}'s testimonial`}
              action={deleteTestimonial}
              redirectTo="/admin/testimonials"
              variant="large"
            />
          </span>
        )}
      </FormActions>
    </form>
  );
}
