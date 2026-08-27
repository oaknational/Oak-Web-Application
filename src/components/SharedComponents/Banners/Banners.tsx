import PromoBanner from "@/components/SharedComponents/PromoBanner";
import { ResolveOakHrefProps } from "@/common-lib/urls";

export default function Banners() {
  const message = "Oak is now used in 72% of schools";
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
