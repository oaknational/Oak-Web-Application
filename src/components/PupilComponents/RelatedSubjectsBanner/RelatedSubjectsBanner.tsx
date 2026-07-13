import SubjectBanner, {
  type SubjectBannerProps,
} from "./banners/SubjectBanner";

import type { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import type { SubjectSlugs } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";

type ProgrammeFields = UnitListingBrowseData[number]["programmeFields"];

type OptionalSubjectDescriptionsType = {
  [key in SubjectSlugs]?: (args: Readonly<BannerProps>) => JSX.Element;
};

type SubjectBannerContent = Omit<SubjectBannerProps, "programmeFields">;

export interface BannerProps {
  readonly programmeFields: ProgrammeFields;
}

const subjectBannerContent = {
  "financial-education": {
    heading: "Check out our new finance lessons!",
    imageAlt: "Illustration of persons head with finance ideas",
    linkText: "Go to new finance lessons",
    subCopy:
      "Learn fun and easy ways to understand money and how to use it in real life.",
    subjectSlug: "financial-education",
    testId: "financial-education-banner",
  },
  "digital-literacy": {
    heading: "Check out our new digital literacy lessons!",
    imageAlt: "Illustration representing digital literacy",
    linkText: "New digital literacy lessons",
    subCopy:
      "Learn fun and easy ways to use technology confidently and safely in real life.",
    subjectSlug: "digital-literacy",
    testId: "digital-literacy-banner",
  },
} satisfies Partial<Record<SubjectSlugs, SubjectBannerContent>>;

const renderSubjectBanner =
  (content: SubjectBannerContent) =>
  ({ programmeFields }: Readonly<BannerProps>) => (
    <SubjectBanner programmeFields={programmeFields} {...content} />
  );

const OptionalSubjectDescriptions: OptionalSubjectDescriptionsType = {
  "financial-education": renderSubjectBanner(
    subjectBannerContent["financial-education"],
  ),
  "digital-literacy": renderSubjectBanner(
    subjectBannerContent["digital-literacy"],
  ),
};

function RelatedSubjectsBanner({
  subjectSlug,
  programmeFields,
}: {
  subjectSlug: SubjectSlugs;
  programmeFields: ProgrammeFields;
}) {
  const descriptionFunction = OptionalSubjectDescriptions[subjectSlug];

  return descriptionFunction ? descriptionFunction({ programmeFields }) : null;
}

export default RelatedSubjectsBanner;
