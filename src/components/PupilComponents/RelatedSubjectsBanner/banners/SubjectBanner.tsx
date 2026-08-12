import {
  generateOakIconURL,
  OakBox,
  OakCard,
  OakFlex,
} from "@oaknational/oak-components";

import type { BannerProps } from "../RelatedSubjectsBanner";

import { resolveOakHref } from "@/common-lib/urls";
import type { SubjectSlugs } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";

export type SubjectBannerProps = BannerProps & {
  readonly heading: string;
  readonly imageAlt: string;
  readonly linkText: string;
  readonly subCopy: string;
  readonly subjectSlug: SubjectSlugs;
  readonly testId: string;
};

function SubjectBanner({
  heading,
  imageAlt,
  linkText,
  programmeFields,
  subCopy,
  subjectSlug,
  testId,
}: Readonly<SubjectBannerProps>) {
  const programmeSlug = `${subjectSlug}-${programmeFields.phase}-${programmeFields.yearSlug}`;

  const href = resolveOakHref({
    page: "pupil-unit-index",
    programmeSlug,
  });

  return (
    <OakFlex
      $width={["100%", "spacing-640", "spacing-960"]}
      $mt="spacing-24"
      data-testid={testId}
    >
      <OakBox
        $width="100%"
        $dropShadow="drop-shadow-centred-standard"
        $borderRadius="border-radius-m2"
      >
        <OakCard
          heading={heading}
          headingLevel="h1"
          href={href}
          cardWidth="100%"
          imageSrc={generateOakIconURL(`subject-${subjectSlug}`)}
          imageAlt={imageAlt}
          subCopy={subCopy}
          subCopyColor="text-primary"
          tagName="New"
          tagBackground="bg-decorative1-main"
          linkText={linkText}
          linkIconName="chevron-right"
          cardOrientation={["column", "row"]}
          imageBackgroundColor="bg-decorative1-main"
        />
      </OakBox>
    </OakFlex>
  );
}

export default SubjectBanner;
