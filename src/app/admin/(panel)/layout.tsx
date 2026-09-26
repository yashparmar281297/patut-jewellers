import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import { getAdminSession } from "@/lib/admin";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await getAdminSession();
  if (!user) redirect("/admin/login");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gold/20 bg-noir text-ivory">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-gold/50">
              <Image src="/brand/monogram.jpg" alt="" fill sizes="36px" className="object-cover" />
            </span>
            <span className="font-caps text-sm tracking-[0.25em] text-gold-light">
              Patut <span className="hidden text-ivory/60 sm:inline">· Catalogue</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="hidden text-ivory/70 hover:text-gold-light sm:inline">
              View site ↗
            </Link>
            <span className="hidden max-w-48 truncate text-ivory/50 md:inline">{user.email}</span>
            <form action={signOut}>
              <button type="submit" className="rounded-full border border-ivory/25 px-4 py-1.5 text-xs hover:border-gold-light hover:text-gold-light">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      {isAdmin ? (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      ) : (
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="font-display text-4xl text-ink">Admin access needed</h1>
          <p className="mt-4 text-muted">
            You are signed in as <strong>{user.email}</strong>, but this account has not been given
            permission to manage the catalogue yet.
          </p>
          <p className="mt-6 rounded-xl bg-cream px-4 py-3 font-mono text-xs text-ink">User ID: {user.id}</p>
        </main>
      )}
    </>
  );
}
