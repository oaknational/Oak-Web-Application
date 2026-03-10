import FinancialEducationDescription from "./descriptions/FinancialEducationDescription";
import RuleOfLawDescription from "./descriptions/RuleOfLawDescription";

import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { SubjectSlugs } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";

type OptionalSubjectDescriptionsType = {
  [key in SubjectSlugs]?: (data: UnitListingData) => JSX.Element;
};

const optionalSubjectDescriptions: OptionalSubjectDescriptionsType = {
  "financial-education": (data) => (
    <FinancialEducationDescription unitListingData={data} />
  ),
  // TD: remove type assertion once curriculum schema is updated
  ["rule-of-law" as SubjectSlugs]: (data: UnitListingData) => (
    <RuleOfLawDescription unitListingData={data} />
  ),
};

interface TeacherSubjectDescriptionProps {
  unitListingData: UnitListingData;
}

const TeacherSubjectDescription: React.FC<TeacherSubjectDescriptionProps> = ({
  unitListingData,
}) => {
  const DescriptionComponent =
    optionalSubjectDescriptions[unitListingData.subjectSlug];

  return DescriptionComponent ? DescriptionComponent(unitListingData) : null;
};

export default TeacherSubjectDescription;
