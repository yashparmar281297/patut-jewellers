"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import JewelIcon from "@/components/JewelIcon";
import SearchOverlay, { SearchIcon } from "@/components/SearchOverlay";
import { categories, metals, type MetalSlug } from "@/lib/catalog";
import { generalWhatsappLink } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MetalSlug | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMetal, setDrawerMetal] = useState<MetalSlug | null>("gold");
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMenu(null);
    setDrawerOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
  }, [drawerOpen]);

  // Transparent over the home hero until the page scrolls.
  const overHero = pathname === "/" && !scrolled && !openMenu;

  return (
    <>
      <AnnouncementBar />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />

      <header
        className={`sticky top-0 z-50 transition-colors duration-500 ${
          overHero
            ? "bg-transparent text-ink"
            : "border-b border-gold/15 bg-ivory/90 text-ink backdrop-blur-md"
        }`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-20 lg:px-10">
          {/* Left nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {metals.map((metal) => (
              <button
                key={metal.slug}
                type="button"
                onMouseEnter={() => setOpenMenu(metal.slug)}
                onClick={() => setOpenMenu(openMenu === metal.slug ? null : metal.slug)}
                aria-expanded={openMenu === metal.slug}
                className="group relative font-caps text-[13px] tracking-[0.22em]"
              >
                {metal.name}
                <span
                  className={`absolute -bottom-2 left-0 h-px bg-gold transition-all duration-500 ${
                    openMenu === metal.slug ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
            <Link
              href="/bridal"
              onMouseEnter={() => setOpenMenu(null)}
              className="font-caps text-[13px] tracking-[0.22em] hover:text-gold"
            >
              Bridal
            </Link>
          </nav>

          <div className="-ml-2 flex items-center justify-self-start lg:hidden">
            <button type="button" onClick={() => setDrawerOpen(true)} className="p-2" aria-label="Open menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M3 7h18M3 12h12M3 17h18" />
              </svg>
            </button>
            <button type="button" onClick={() => setSearchOpen(true)} className="p-2" aria-label="Search">
              <SearchIcon className="h-[22px] w-[22px]" />
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Patut Jewellers home">
            <span className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-gold/50 lg:h-14 lg:w-14">
              <Image src="/brand/monogram.jpg" alt="" fill sizes="56px" className="object-cover" priority />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-caps text-2xl tracking-[0.32em] text-gold">PATUT</span>
              <span className="mt-1 font-caps text-[9px] tracking-[0.55em] opacity-80">JEWELLERS</span>
            </span>
          </Link>

          {/* Right nav */}
          <nav className="flex items-center justify-end gap-6">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 font-caps text-[13px] tracking-[0.22em] hover:text-gold lg:flex"
            >
              <SearchIcon className="h-[18px] w-[18px]" />
              Search
            </button>
            <Link
              href="/#story"
              className="hidden font-caps text-[13px] tracking-[0.22em] hover:text-gold lg:inline"
            >
              Our Story
            </Link>
            <a
              href={generalWhatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-gold px-3.5 py-2 font-caps text-[10px] tracking-[0.18em] text-gold-deep transition-colors hover:bg-gold hover:text-ivory sm:px-5 sm:text-[11px]"
            >
              Book Visit
            </a>
          </nav>
        </div>

        {/* Mega menu */}
        {metals.map((metal) => (
          <div
            key={metal.slug}
            className={`absolute inset-x-0 top-full hidden border-b lg:block border-gold/20 bg-ivory text-ink shadow-[0_30px_60px_-30px_rgba(120,90,40,0.35)] transition-all duration-500 ${
              openMenu === metal.slug
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-2 opacity-0"
            }`}
          >
            <div className="mx-auto grid max-w-7xl grid-cols-[1fr_320px] gap-12 px-10 py-10">
              <div>
                <p className="font-caps text-[11px] tracking-[0.35em] text-gold-deep">
                  {metal.name} Collection
                </p>
                <ul className="mt-6 grid grid-cols-3 gap-x-8 gap-y-2">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/collections/${metal.slug}/${category.slug}`}
                        className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-cream/70"
                      >
                        <JewelIcon
                          category={category.slug}
                          metal={metal.slug}
                          className="h-10 w-10 text-gold transition-transform duration-500 group-hover:scale-110"
                        />
                        <span className="font-display text-xl text-ink group-hover:text-gold-deep">
                          {category.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`/collections/${metal.slug}`}
                className={`sheen group relative flex min-h-[15rem] flex-col justify-end overflow-hidden rounded-2xl p-7 ${
                  metal.slug === "gold"
                    ? "bg-[radial-gradient(circle_at_30%_20%,#fbeecb,#dcb465_45%,#b08132)] text-ink"
                    : "bg-[radial-gradient(circle_at_30%_20%,#ffffff,#d9dde3_40%,#2a2f38)] text-ivory"
                }`}
              >
                <JewelIcon
                  category={metal.slug === "gold" ? "necklace" : "ladies-ring"}
                  metal={metal.slug}
                  className="absolute right-5 top-5 h-20 w-20 opacity-70 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110"
                />
                <p className="font-caps text-[10px] tracking-[0.35em] opacity-80">{metal.purity}</p>
                <p className="mt-2 font-display text-3xl italic">{metal.tagline}</p>
                <p className="mt-4 font-caps text-[11px] tracking-[0.25em] underline underline-offset-8">
                  View all {metal.name}
                </p>
              </Link>
            </div>
          </div>
        ))}
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-[61] flex w-[86%] max-w-sm flex-col overflow-y-auto bg-ivory transition-transform duration-500 lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between border-b border-gold/20 px-5 py-4">
          <span className="font-caps text-lg tracking-[0.3em] text-gold">PATUT</span>
          <button type="button" onClick={() => setDrawerOpen(false)} className="p-2" aria-label="Close menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {metals.map((metal) => (
          <div key={metal.slug} className="border-b border-gold/15">
            <button
              type="button"
              onClick={() => setDrawerMetal(drawerMetal === metal.slug ? null : metal.slug)}
              className="flex w-full items-center justify-between px-5 py-4 font-caps tracking-[0.25em]"
            >
              {metal.name}
              <span className={`text-gold transition-transform ${drawerMetal === metal.slug ? "rotate-45" : ""}`}>+</span>
            </button>
            {drawerMetal === metal.slug && (
              <ul className="grid grid-cols-2 gap-1 px-3 pb-4">
                <li className="col-span-2">
                  <Link href={`/collections/${metal.slug}`} className="block px-2 py-2 text-sm text-gold-deep underline underline-offset-4">
                    View all {metal.name}
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/collections/${metal.slug}/${category.slug}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-cream"
                    >
                      <JewelIcon category={category.slug} metal={metal.slug} className="h-8 w-8 text-gold" />
                      <span className="font-display text-lg">{category.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div className="flex flex-col gap-1 px-5 py-4 font-caps text-sm tracking-[0.2em]">
          <Link href="/bridal" className="py-2">Bridal</Link>
          <Link href="/#story" className="py-2">Our Story</Link>
          <Link href="/#visit" className="py-2">Book a Visit</Link>
        </div>
      </aside>
    </>
  );
}
