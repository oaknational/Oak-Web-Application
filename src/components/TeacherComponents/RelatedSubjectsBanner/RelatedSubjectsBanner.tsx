import FinancialEducationBanner from "./banners/FinancialEducationBanner";

import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import { SubjectSlugs } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";

type KeyStageSlug =
  UnitListingBrowseData[number]["programmeFields"]["keystageSlug"];

type Phase = UnitListingBrowseData[number]["programmeFields"]["phase"];

type OptionalSubjectDescriptionsType = {
  [key in SubjectSlugs]?: (args: BannerProps) => JSX.Element;
};

export interface BannerProps {
  readonly keyStageSlug: KeyStageSlug;
  readonly phase: Phase;
  readonly isDesktop: boolean;
}

const OptionalSubjectDescriptions: OptionalSubjectDescriptionsType = {
  "financial-education": ({
    keyStageSlug,
    phase,
    isDesktop,
  }: Readonly<BannerProps>) => (
    <FinancialEducationBanner
      keyStageSlug={keyStageSlug}
      phase={phase}
      isDesktop={isDesktop}
    />
  ),
};

function RelatedSubjectsBanner({
  subjectSlug,
  keyStageSlug,
  phase,
  isDesktop,
}: {
  subjectSlug: SubjectSlugs;
  keyStageSlug: KeyStageSlug;
  phase: Phase;
  isDesktop: boolean;
}) {
  const descriptionFunction = OptionalSubjectDescriptions[subjectSlug];

  return descriptionFunction
    ? descriptionFunction({ keyStageSlug, phase, isDesktop })
    : null;
}

export default RelatedSubjectsBanner;
