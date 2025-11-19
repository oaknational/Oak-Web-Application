import {
  OakFlex,
  OakHeading,
  OakLinkCard,
  OakP,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { BannerProps } from "../RelatedSubjectsBanner";

import { resolveOakHref } from "@/common-lib/urls";

function FinancialEducationBanner({ programmeFields }: Readonly<BannerProps>) {
  const programmeSlug = `financial-education-${programmeFields.phase}-${programmeFields.yearSlug}`;

  const href = resolveOakHref({
    page: "pupil-unit-index",
    programmeSlug,
  });

  const mainSection = (
    <OakFlex $flexDirection="column" $gap="spacing-12">
      <OakHeading tag="h1" $font="heading-5">
        Check out our new finance lessons!
      </OakHeading>
      <OakP>
        Learn fun and easy ways to understand money and how to use it in real
        life.
      </OakP>
      <OakTertiaryButton iconName="chevron-right" width="100%" isTrailingIcon>
        Go to new finance lessons
      </OakTertiaryButton>
    </OakFlex>
  );

  return (
    <OakFlex
      $width={["100%", "spacing-640", "spacing-960"]}
      $mt="spacing-24"
      data-testid="financial-education-banner"
    >
      <OakLinkCard
        mainSection={mainSection}
        iconName={"subject-financial-education"}
        iconAlt="Illustration of persons head with finance ideas"
        href={href}
        showNew
      />
    </OakFlex>
  );
}

export default FinancialEducationBanner;
