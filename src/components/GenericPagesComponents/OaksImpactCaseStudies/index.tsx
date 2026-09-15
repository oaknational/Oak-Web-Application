import { CaseStudyCard } from "@/common-lib/cms-types/caseStudy";
import { CaseStudies } from "@/components/GenericPagesComponents/CaseStudies";

export type OaksImpactCaseStudiesProps = {
  caseStudies: CaseStudyCard[];
};

export const OaksImpactCaseStudies = ({
  caseStudies,
}: OaksImpactCaseStudiesProps) => {
  return <CaseStudies title="Case studies" caseStudies={caseStudies} />;
};
