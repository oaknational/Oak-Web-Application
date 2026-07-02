import {
  generateOakIconURL,
  OakBox,
  OakCard,
  OakFlex,
} from "@oaknational/oak-components";

import { BannerProps } from "../RelatedSubjectsBanner";

import { resolveOakHref } from "@/common-lib/urls";

function DigitalLiteracyBanner({ programmeFields }: Readonly<BannerProps>) {
  const programmeSlug = `digital-literacy-${programmeFields.phase}-${programmeFields.yearSlug}`;

  const href = resolveOakHref({
    page: "pupil-unit-index",
    programmeSlug,
  });

  return (
    <OakFlex
      $width={["100%", "spacing-640", "spacing-960"]}
      $mt="spacing-24"
      data-testid="digital-literacy-banner"
    >
      <OakBox
        $width="100%"
        $dropShadow="drop-shadow-centred-standard"
        $borderRadius="border-radius-m2"
      >
        <OakCard
          heading="Check out our new digital literacy lessons!"
          headingLevel="h1"
          href={href}
          cardWidth="100%"
          imageSrc={generateOakIconURL("subject-digital-literacy")}
          imageAlt="Illustration representing digital literacy"
          subCopy="Learn fun and easy ways to use technology confidently and safely in real life."
          subCopyColor="text-primary"
          tagBackground="bg-decorative1-main"
          linkText="Go to new digital literacy lessons"
          linkIconName="chevron-right"
          cardOrientation={["column", "row"]}
          imageBackgroundColor="bg-decorative1-main"
        />
      </OakBox>
    </OakFlex>
  );
}

export default DigitalLiteracyBanner;
