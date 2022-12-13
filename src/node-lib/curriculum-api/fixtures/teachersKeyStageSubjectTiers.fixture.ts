import { TeachersKeyStageSubjectTiersData } from "..";

const teachersKeyStageSubjectTiersFixture = (
  partial?: Partial<TeachersKeyStageSubjectTiersData>
): TeachersKeyStageSubjectTiersData => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key Stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    lessonCount: 101,
    unitCount: 9,
    tiers: [
      {
        title: "Foundation",
        slug: "foundation",
        unitCount: 3,
        lessonCount: 34,
      },
      {
        title: "Core",
        slug: "core",
        unitCount: 3,
        lessonCount: 38,
      },
      {
        title: "Higher",
        slug: "higher",
        unitCount: 3,
        lessonCount: 29,
      },
    ],
    ...partial,
  };
};

export default teachersKeyStageSubjectTiersFixture;
