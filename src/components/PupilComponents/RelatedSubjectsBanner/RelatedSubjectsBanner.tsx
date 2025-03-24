import FinancialEducationBanner from "./banners/FinancialEducationBanner";

import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import { SubjectSlugs } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";

type ProgrammeFields = UnitListingBrowseData[number]["programmeFields"];

type OptionalSubjectDescriptionsType = {
  [key in SubjectSlugs]?: (args: BannerProps) => JSX.Element;
};

export interface BannerProps {
  readonly programmeFields: ProgrammeFields;
}

const OptionalSubjectDescriptions: OptionalSubjectDescriptionsType = {
  "financial-education": ({ programmeFields }) => (
    <FinancialEducationBanner programmeFields={programmeFields} />
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
