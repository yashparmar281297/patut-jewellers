import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { getAdminSession } from "@/lib/admin";

export default async function EditTestimonialPage(props: PageProps<"/admin/testimonials/[id]">) {
  const { id } = await props.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { supabase } = await getAdminSession();
  const { data: t } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (!t) notFound();

  return (
    <div>
      <PageHeader
        section="Testimonials"
        title="Edit Testimonial"
        back={{ href: "/admin/testimonials", label: "All testimonials" }}
      />
      <TestimonialForm
        initial={{
          id: t.id,
          customerName: t.customer_name,
          location: t.location,
          rating: t.rating,
          message: t.message,
          photo: t.photo,
          isPublished: t.is_published,
          sortOrder: String(t.sort_order),
        }}
      />
    </div>
  );
}
