import { OakCarousel, OakQuote } from "@oaknational/oak-components";

import { HomePage } from "@/common-lib/cms-types";
import { imageBuilder } from "@/components/HooksAndUtils/sanityImageBuilder";

export type TestimonialsProps = {
  testimonials: HomePage["testimonials"];
};

export const Testimonials = ({ testimonials }: TestimonialsProps) => {
  if (!testimonials || testimonials.length === 0) return null;

  const items = testimonials.map((testimonial) => {
    const authorTitle = testimonial.quote.organisation
      ? `${testimonial.quote.role}, ${testimonial.quote.organisation}`
      : testimonial.quote.role;

    /**
     * finalUrl is the proxied url
     */
    const finalUrl = testimonial.image?.asset
      ? imageBuilder.image(testimonial.image.asset).url()?.toString()
      : undefined;

    return (
      <OakQuote
        quote={testimonial.quote.text}
        authorImageSrc={finalUrl}
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
