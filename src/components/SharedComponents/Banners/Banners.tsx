import {
  OakFlex,
  OakP,
  OakPromoTag,
  OakSpan,
} from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";

import { PromoSpan } from "../PromoSpan/PromoSpan";

import PromoBanner from "@/components/SharedComponents/PromoBanner";
import { ResolveOakHrefProps } from "@/common-lib/urls";

export default function Banners({
  hideIfFeatureFlagDisabled,
}: {
  hideIfFeatureFlagDisabled?: boolean;
}) {
  const isMythbustingCampaignActive = useFeatureFlagEnabled(
    "mythbusting-campaign",
  );

  if (hideIfFeatureFlagDisabled && !isMythbustingCampaignActive) {
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
  const curriculumContent = (
    <OakFlex $gap="space-between-ssx" $alignItems={"center"}>
      <OakPromoTag /> Subjects added
    </OakFlex>
  );

  const message = isMythbustingCampaignActive
    ? mythbustingContent
    : curriculumContent;
  const background = isMythbustingCampaignActive ? "lemon30" : "lemon";
  const ctaText = isMythbustingCampaignActive
    ? "Learn why"
    : "See curriculum plans";

  const linkProps: ResolveOakHrefProps = isMythbustingCampaignActive
    ? { page: "campaign-single", campaignSlug: "mythbusting" }
    : { page: "curriculum-landing-page" };

  return (
    <PromoBanner
      background={background}
      ctaText={ctaText}
      message={message}
      {...linkProps}
    />
  );
}
