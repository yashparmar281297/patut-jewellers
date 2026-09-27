import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { signOut } from "@/app/admin/actions/auth";
import { getAdminSession } from "@/lib/admin";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await getAdminSession();
  if (!user) redirect("/admin/login");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gold/25 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-gold/50">
              <Image src="/brand/monogram.jpg" alt="" fill sizes="40px" className="object-cover" />
            </span>
            <span className="leading-none">
              <span className="text-gilded block font-caps text-base tracking-[0.25em]">PATUT</span>
              <span className="mt-0.5 block font-caps text-[9px] tracking-[0.3em] text-muted">Admin Panel</span>
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" target="_blank" className="hidden text-gold-deep hover:underline sm:inline">
              View website ↗
            </Link>
            <span className="hidden max-w-48 truncate text-muted md:inline">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-ink hover:border-gold hover:bg-cream"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        {isAdmin && (
          <div className="mx-auto max-w-7xl px-3 pb-2.5 sm:px-5">
            <AdminNav />
          </div>
        )}
      </header>

      {isAdmin ? (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      ) : (
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="font-display text-4xl text-ink">Admin access needed</h1>
          <p className="mt-4 text-muted">
            You are signed in as <strong>{user.email}</strong>, but this account has not been given
            permission to manage the website yet.
          </p>
          <p className="mt-6 rounded-xl bg-cream px-4 py-3 font-mono text-xs text-ink">User ID: {user.id}</p>
        </main>
      )}
    </>
  );
}
