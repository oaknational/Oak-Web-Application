import {
  OakFlex,
  OakHeading,
  OakLinkCard,
  OakP,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { BannerProps } from "../RelatedSubjectsBanner";

import { resolveOakHref } from "@/common-lib/urls";

function DigitalLiteracyBanner({ programmeFields }: Readonly<BannerProps>) {
  const programmeSlug = `digital-literacy-${programmeFields.phase}-${programmeFields.yearSlug}`;

  const href = resolveOakHref({
    page: "pupil-unit-index",
    programmeSlug,
  });

  const mainSection = (
    <OakFlex $flexDirection="column" $gap="spacing-12">
      <OakHeading tag="h1" $font="heading-5">
        Check out our new digital literacy lessons!
      </OakHeading>
      <OakP>
        Learn fun and easy ways to use technology confidently and safely in real
        life.
      </OakP>
      <OakTertiaryButton iconName="chevron-right" width="100%" isTrailingIcon>
        Go to new digital literacy lessons
      </OakTertiaryButton>
    </OakFlex>
  );

  return (
    <OakFlex
      $width={["100%", "spacing-640", "spacing-960"]}
      $mt="spacing-24"
      data-testid="digital-literacy-banner"
    >
      <OakLinkCard
        mainSection={mainSection}
        iconName={"subject-digital-literacy"}
        iconAlt="Illustration representing digital literacy"
        href={href}
        showNew
      />
    </OakFlex>
  );
}

export default DigitalLiteracyBanner;
