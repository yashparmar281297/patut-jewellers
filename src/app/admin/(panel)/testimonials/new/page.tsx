import PageHeader from "@/components/admin/PageHeader";
import TestimonialForm from "@/components/admin/TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <div>
      <PageHeader
        section="Testimonials"
        title="Add Testimonial"
        back={{ href: "/admin/testimonials", label: "All testimonials" }}
      />
      <TestimonialForm
        initial={{ customerName: "", location: "", rating: 5, message: "", photo: null, isPublished: true, sortOrder: "0" }}
      />
    </div>
  );
}
