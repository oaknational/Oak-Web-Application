import { OakP, OakSpan } from "@oaknational/oak-components";

import { PromoSpan } from "../PromoSpan/PromoSpan";

import PromoBanner from "@/components/SharedComponents/PromoBanner";
import { ResolveOakHrefProps } from "@/common-lib/urls";

export default function Banners({
  hideIfFeatureFlagDisabled,
}: {
  hideIfFeatureFlagDisabled?: boolean;
}) {
  if (hideIfFeatureFlagDisabled) {
    return null;
  }

  const mythbustingContent = (
    <OakP $font={"body-2"}>
      <PromoSpan>
        <OakSpan $font={"body-3-bold"}>Myths</OakSpan>
      </PromoSpan>{" "}
      about teaching <b>can hold you back</b>
    </OakP>
  );

  const message = mythbustingContent;
  const background = "lemon30";
  const ctaText = "Learn why";

  const linkProps: ResolveOakHrefProps = {
    page: "campaign-single",
    campaignSlug: "mythbusting",
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
