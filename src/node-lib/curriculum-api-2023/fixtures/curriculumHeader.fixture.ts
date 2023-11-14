import { CurriculumHeaderData } from "..";

const curriculumHeaderFixture = (
  partial?: Partial<CurriculumHeaderData>,
): CurriculumHeaderData => {
  return {
    subject: "English",
    subjectSlug: "english",
    phase: "Secondary",
    phaseSlug: "secondary",
    examboard: "AQA",
    examboardSlug: "aqa",
    ...partial,
  };
};
export default curriculumHeaderFixture;
