import { OakP } from "@oaknational/oak-components";

import PromoBanner from "@/components/SharedComponents/PromoBanner";
import { ResolveOakHrefProps } from "@/common-lib/urls";

export default function Banners() {
  const message = (
    <OakP>
      Oak is now used in <strong>72%</strong> of schools
    </OakP>
  );
  const background = "bg-decorative2-main";
  const ctaText = "Explore our impact";

  const linkProps: ResolveOakHrefProps = {
    page: "about-oaks-impact",
  };

  return (
    <PromoBanner
      background={background}
      ctaText={ctaText}
      message={message}
      {...linkProps}
    />
  );
}
