import { OakP } from "@oaknational/oak-components";

import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import { SubjectSlugs } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";

type OptionalSubjectDescriptionsType = {
  [key in SubjectSlugs]?: (
    programmeFields?: UnitListingBrowseData[number]["programmeFields"],
  ) => JSX.Element;
};

const OptionalSubjectDescriptions: OptionalSubjectDescriptionsType = {
  "financial-education": () => (
    <OakP data-testid="pupil-financial-education-description">
      These lessons will help you learn useful finance skills that you can use
      in everyday life.
    </OakP>
  ),
};

export default function PupilSubjectDescription({
  programmeFields,
}: {
  programmeFields: UnitListingBrowseData[number]["programmeFields"];
}) {
  const descriptionFunction =
    OptionalSubjectDescriptions[programmeFields.subjectSlug];

  return descriptionFunction ? descriptionFunction(programmeFields) : null;
}
