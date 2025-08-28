import { OakFlex, OakP, OakPromoTag } from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";

import PromoBanner from "@/components/SharedComponents/PromoBanner";

export default function Banners() {
  const isMythbustingCampaignActive = useFeatureFlagEnabled(
    "mythbusting-campaign",
  );

  const muthbustingContent = (
    <OakP>Myths about teaching can hold you back</OakP>
  );
  const curriculumContent = (
    <OakFlex $gap="space-between-ssx">
      <OakPromoTag /> Subjects added
    </OakFlex>
  );

  const message = isMythbustingCampaignActive
    ? muthbustingContent
    : curriculumContent;
  const background = isMythbustingCampaignActive ? "lemon30" : "lemon";
  const ctaText = isMythbustingCampaignActive
    ? "Learn why"
    : "See curriculum plans";

  // TODO: add campaign page
  const page = isMythbustingCampaignActive
    ? "curriculum-landing-page"
    : "curriculum-landing-page";

  return (
    <PromoBanner
      background={background}
      ctaText={ctaText}
      page={page}
      message={message}
    />
  );
}
