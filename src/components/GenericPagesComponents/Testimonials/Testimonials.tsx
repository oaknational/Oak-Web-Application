import { OakCarousel, OakFlex, OakQuote } from "@oaknational/oak-components";

import { HomePage } from "@/common-lib/cms-types";

export type TestimonialsProps = {
  testimonials: HomePage["testimonials"];
};

export const Testimonials = ({ testimonials }: TestimonialsProps) => {
  if (!testimonials || testimonials.length === 0) return null;

  const items = testimonials.map((testimonial) => {
    const authorTitle = testimonial.quote.organisation
      ? `${testimonial.quote.role}, ${testimonial.quote.organisation}`
      : testimonial.quote.role;
    return (
      <OakQuote
        quote={testimonial.quote.text}
        authorImageSrc={testimonial.image?.asset?.url}
        authorName={testimonial.quote.attribution}
        authorTitle={authorTitle}
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
