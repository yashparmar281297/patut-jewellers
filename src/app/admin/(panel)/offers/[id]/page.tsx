import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import OfferForm from "@/components/admin/OfferForm";
import { getAdminSession } from "@/lib/admin";

export default async function EditOfferPage(props: PageProps<"/admin/offers/[id]">) {
  const { id } = await props.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { supabase } = await getAdminSession();
  const { data: offer } = await supabase.from("offers").select("*").eq("id", id).maybeSingle();
  if (!offer) notFound();

  return (
    <div>
      <PageHeader section="Offers" title="Edit Offer" back={{ href: "/admin/offers", label: "All offers" }} />
      <OfferForm
        initial={{
          id: offer.id,
          title: offer.title,
          description: offer.description,
          badge: offer.badge,
          image: offer.image,
          validUntil: offer.valid_until ?? "",
          isActive: offer.is_active,
          sortOrder: String(offer.sort_order),
        }}
      />
    </div>
  );
}
