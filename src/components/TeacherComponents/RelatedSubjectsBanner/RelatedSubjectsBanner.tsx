import FinancialEducationBanner from "./banners/FinancialEducationBanner";

import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import { SubjectSlugs } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";

type KeyStageSlug =
  UnitListingBrowseData[number]["programmeFields"]["keystageSlug"];

type OptionalSubjectDescriptionsType = {
  [key in SubjectSlugs]?: (args: BannerProps) => JSX.Element;
};

export interface BannerProps {
  readonly keyStageSlug: KeyStageSlug;
  readonly isDesktop: boolean;
}

const OptionalSubjectDescriptions: OptionalSubjectDescriptionsType = {
  "financial-education": ({
    keyStageSlug,
    isDesktop,
  }: Readonly<BannerProps>) => (
    <FinancialEducationBanner
      keyStageSlug={keyStageSlug}
      isDesktop={isDesktop}
    />
  ),
};

function RelatedSubjectsBanner({
  subjectSlug,
  keyStageSlug,
  isDesktop,
}: {
  subjectSlug: SubjectSlugs;
  keyStageSlug: KeyStageSlug;
  isDesktop: boolean;
}) {
  const descriptionFunction = OptionalSubjectDescriptions[subjectSlug];

  return descriptionFunction
    ? descriptionFunction({ keyStageSlug, isDesktop })
    : null;
}

export default RelatedSubjectsBanner;
