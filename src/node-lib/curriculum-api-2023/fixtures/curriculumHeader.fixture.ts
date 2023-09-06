import { CurriculumHeaderData } from "..";

const curriculumHeaderFixture = (
  partial?: Partial<CurriculumHeaderData>,
): CurriculumHeaderData => {
  return {
    subject: { title: "Maths", slug: "maths" },
    phase: { title: "Secondary", slug: "secondary" },
    examBoard: { title: "", slug: "" },
    ...partial,
  };
};
export default curriculumHeaderFixture;
