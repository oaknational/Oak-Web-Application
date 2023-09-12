import { CurriculumHeaderData } from "..";

const curriculumHeaderFixture = (
  partial?: Partial<CurriculumHeaderData>
): CurriculumHeaderData => {
  return {
    subject: "Maths",
    subjectSlug: "maths",
    phase: "Secondary",
    phaseSlug: "secondary",
    ...partial,
  };
};
export default curriculumHeaderFixture;
