import {
  OakFlex,
  OakHeading,
  OakLinkCard,
  OakP,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { BannerProps } from "../RelatedSubjectsBanner";

import { resolveOakHref } from "@/common-lib/urls";

function FinancialEducationBanner({ keyStageSlug, isDesktop }: BannerProps) {
  const programmeSlug = `financial-education-secondary-${keyStageSlug}`;

  const href = resolveOakHref({
    page: "unit-index",
    programmeSlug,
  });

  const mainSection = (
    <OakFlex
      $flexDirection="column"
      $gap="space-between-xs"
      data-testid="financial-education-banner"
    >
      <OakHeading tag="h1" $font="heading-5">
        Try our new financial education teaching resources
      </OakHeading>
      <OakP>
        A series of sequenced teaching resources offering practical knowledge
        and skills to help pupils with their financial education.
      </OakP>
      <OakTertiaryButton iconName="chevron-right" width="100%" isTrailingIcon>
        Go to new finance lessons
      </OakTertiaryButton>
    </OakFlex>
  );

  return (
    <OakFlex $mt="space-between-m">
      <OakLinkCard
        mainSection={mainSection}
        iconName={"subject-financial-education"}
        iconAlt="Illustration of persons head with finance ideas"
        href={href}
        showNew
        narrow={isDesktop}
      />
    </OakFlex>
  );
}

export default FinancialEducationBanner;
