import { OakCarousel, OakQuote } from "@oaknational/oak-components";

import { HomePage } from "@/common-lib/cms-types";

export type TestimonialsProps = {
  testimonials: HomePage["testimonials"];
};

export const Testimonials = ({ testimonials }: TestimonialsProps) => {
  if (!testimonials || testimonials.length === 0) return null;

  const items = testimonials.map((testimonial) => {
    return (
      <OakQuote
        quote={testimonial.quote.text}
        authorImageSrc={testimonial.image?.asset?.url}
        authorName={testimonial.quote.attribution}
        authorTitle={`${testimonial.quote.role}, ${testimonial.quote.organisation}`}
        color="transparent"
      />
    );
  });

  return (
    <OakCarousel
      content={items}
      backLabel="Previous testimonial"
      fwdLabel="Next testimonial"
      containerLabel="Testimonials"
    />
  );
};
