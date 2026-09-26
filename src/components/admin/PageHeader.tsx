import Link from "next/link";

export default function PageHeader({
  section,
  title,
  subtitle,
  back,
  action,
}: {
  section: string;
  title: string;
  subtitle?: string;
  back?: { href: string; label: string };
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <Link href={back.href} className="mb-3 inline-flex text-sm text-muted hover:text-gold-deep">
            ← {back.label}
          </Link>
        )}
        <p className="font-caps text-[10px] tracking-[0.3em] text-gold-deep">Patut Jewellers / {section}</p>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="bg-gold inline-flex h-11 items-center rounded-full px-6 font-caps text-[11px] tracking-[0.2em] text-ink shadow-[0_10px_30px_-12px_rgba(184,137,59,0.8)]"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
