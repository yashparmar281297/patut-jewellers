import PageHeader from "@/components/admin/PageHeader";
import OfferForm from "@/components/admin/OfferForm";

export default function NewOfferPage() {
  return (
    <div>
      <PageHeader section="Offers" title="Add Offer" back={{ href: "/admin/offers", label: "All offers" }} />
      <OfferForm
        initial={{ title: "", description: "", badge: "", image: null, validUntil: "", isActive: true, sortOrder: "0" }}
      />
    </div>
  );
}
