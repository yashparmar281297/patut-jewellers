import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-muted hover:text-gold-deep">← All products</Link>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Add product</h1>
      <div className="mt-8">
        <ProductForm
          initial={{
            name: "",
            slug: "",
            metal: "gold",
            category: "necklace",
            purity: "22K",
            weight: "",
            diamondCarat: "",
            description: "",
            images: [],
            isNew: true,
            isBestseller: false,
            isPublished: true,
            sortOrder: "0",
          }}
        />
      </div>
    </div>
  );
}
