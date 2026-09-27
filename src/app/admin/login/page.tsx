import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/admin";

export default async function LoginPage() {
  const { user } = await getAdminSession();
  if (user) redirect("/admin");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#f3eadd,#e7d5bc_55%,#dbc6ab)] px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-paper/60 blur-[120px]" />
      <div className="relative w-full max-w-sm rounded-3xl border border-gold/30 bg-paper/90 p-8 shadow-[0_40px_80px_-40px_rgba(123,83,33,0.6)] backdrop-blur sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-gold/50">
            <Image src="/brand/monogram.jpg" alt="" fill sizes="64px" className="object-cover" />
          </span>
          <p className="mt-4 font-caps text-xl tracking-[0.3em] text-gilded">PATUT</p>
          <p className="mt-1 font-caps text-[10px] tracking-[0.35em] text-muted">Catalogue Admin</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
