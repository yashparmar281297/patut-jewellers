import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/admin";

export default async function LoginPage() {
  const { user } = await getAdminSession();
  if (user) redirect("/admin");

  return (
    <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-noir px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]" />
      <div className="relative w-full max-w-sm rounded-3xl border border-gold/25 bg-ivory p-8 shadow-2xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-gold/50">
            <Image src="/brand/monogram.jpg" alt="" fill sizes="64px" className="object-cover" />
          </span>
          <p className="mt-4 font-caps text-xl tracking-[0.3em] text-gold">PATUT</p>
          <p className="mt-1 font-caps text-[10px] tracking-[0.35em] text-muted">Catalogue Admin</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
