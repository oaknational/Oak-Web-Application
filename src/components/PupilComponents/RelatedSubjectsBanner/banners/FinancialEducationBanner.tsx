import {
  generateOakIconURL,
  OakBox,
  OakCard,
  OakFlex,
} from "@oaknational/oak-components";

import { BannerProps } from "../RelatedSubjectsBanner";

import { resolveOakHref } from "@/common-lib/urls";

function FinancialEducationBanner({ programmeFields }: Readonly<BannerProps>) {
  const programmeSlug = `financial-education-${programmeFields.phase}-${programmeFields.yearSlug}`;

  const href = resolveOakHref({
    page: "pupil-unit-index",
    programmeSlug,
  });

  return (
    <OakFlex
      $width={["100%", "spacing-640", "spacing-960"]}
      $mt="spacing-24"
      data-testid="financial-education-banner"
    >
      <OakBox
        $width="100%"
        $dropShadow="drop-shadow-centred-standard"
        $borderRadius="border-radius-m2"
      >
        <OakCard
          heading="Check out our new finance lessons!"
          headingLevel="h1"
          href={href}
          cardWidth="100%"
          imageSrc={generateOakIconURL("subject-financial-education")}
          imageAlt="Illustration of persons head with finance ideas"
          subCopy="Learn fun and easy ways to understand money and how to use it in real life."
          subCopyColor="text-primary"
          tagName="New"
          tagBackground="bg-decorative1-main"
          linkText="Go to new finance lessons"
          linkIconName="chevron-right"
          cardOrientation={["column", "row"]}
          imageBackgroundColor="bg-decorative1-main"
        />
      </OakBox>
    </OakFlex>
  );
}

export default FinancialEducationBanner;
