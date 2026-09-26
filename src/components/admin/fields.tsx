export const inputClass =
  "mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

export function borderFor(errors: Record<string, string>, key: string) {
  return errors[key] ? "border-red-400" : "border-gold/30";
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-caps text-[10px] tracking-[0.25em] text-muted">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-red-700">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-muted">{hint}</span>
      )}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${
        checked ? "border-gold bg-cream" : "border-gold/25"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#b8893b]"
      />
      {label}
    </label>
  );
}

export function FormActions({
  saving,
  busy,
  saveLabel,
  onCancel,
  children,
}: {
  saving: boolean;
  busy: boolean;
  saveLabel: string;
  onCancel: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-gold/20 bg-ivory/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border lg:col-span-2">
      <button
        type="submit"
        disabled={busy}
        className="bg-gold rounded-full px-8 py-3 font-caps text-xs tracking-[0.2em] text-ink disabled:opacity-50"
      >
        {saving ? "Saving…" : saveLabel}
      </button>
      <button type="button" onClick={onCancel} className="rounded-full px-5 py-3 text-sm text-muted hover:text-ink">
        Cancel
      </button>
      {children}
    </div>
  );
}
