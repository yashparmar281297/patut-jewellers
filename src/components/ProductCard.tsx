import Link from "next/link";
import JewelIcon from "@/components/JewelIcon";
import TiltCard from "@/components/TiltCard";
import { getCategory, type Product } from "@/lib/catalog";

export default function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  const isDiamond = product.metal === "diamond";

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <TiltCard max={8} className="rounded-2xl">
        <div
          className={`sheen relative aspect-[4/5] overflow-hidden rounded-2xl ${
            isDiamond
              ? "bg-[radial-gradient(circle_at_50%_35%,#ffffff,#eef0f3_45%,#d7dbe1)]"
              : "bg-[radial-gradient(circle_at_50%_35%,#fffaf0,#f1e5d0_50%,#e2cda7)]"
          }`}
        >
          <div className="absolute inset-x-8 bottom-8 h-6 rounded-full bg-noir/10 blur-xl" />
          <JewelIcon
            category={product.category}
            metal={product.metal}
            className={`absolute inset-0 m-auto h-3/5 w-3/5 transition-transform duration-700 ease-[var(--ease-luxe)] [transform:translateZ(40px)] group-hover:scale-110 ${
              isDiamond ? "text-[#8b8f97]" : "text-gold"
            }`}
          />
          {(product.isNew || product.isBestseller) && (
            <span className="absolute left-4 top-4 rounded-full bg-noir/85 px-3 py-1 font-caps text-[9px] tracking-[0.25em] text-gold-light">
              {product.isNew ? "New" : "Bestseller"}
            </span>
          )}
          <span className="absolute right-4 top-4 font-caps text-[10px] tracking-[0.2em] text-ink/60">
            {product.purity}
          </span>
        </div>
      </TiltCard>
      <div className="mt-4 text-center">
        <p className="font-caps text-[10px] tracking-[0.3em] text-muted">
          {isDiamond ? "Diamond" : "Gold"} · {category?.name}
        </p>
        <h3 className="mt-1 font-display text-2xl text-ink transition-colors group-hover:text-gold-deep">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {product.weight} g{product.diamondCarat ? ` · ${product.diamondCarat} ct` : ""}
        </p>
      </div>
    </Link>
  );
}
