import { TeachersKeyStageSubjectsData } from "..";

const teachersKeyStageSubjectsFixture = (
  partial?: Partial<TeachersKeyStageSubjectsData>
): TeachersKeyStageSubjectsData => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key Stage 4",
    subjects: [
      {
        slug: "latin",
        title: "Latin",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessonCount: 9,
        unitCount: 4,
      },
      {
        slug: "computing-non-gcse",
        title: "Computing (Non-GCSE)",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessonCount: 23,
        unitCount: 4,
      },
      {
        slug: "rshe-pshe",
        title: "RSHE (PSHE)",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessonCount: 64,
        unitCount: 13,
      },
      {
        slug: "citizenship",
        title: "Citizenship",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessonCount: 72,
        unitCount: 12,
      },
      {
        slug: "computing",
        title: "Computing",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessonCount: 112,
        unitCount: 15,
      },
      {
        slug: "german",
        title: "German",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessonCount: 152,
        unitCount: 8,
      },
      {
        slug: "spanish",
        title: "Spanish",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessonCount: 151,
        unitCount: 8,
      },
      {
        slug: "maths",
        title: "Maths",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessonCount: 831,
        unitCount: 191,
      },
      {
        slug: "religious-education",
        title: "Religious Education",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessonCount: 131,
        unitCount: 10,
      },
      {
        slug: "french",
        title: "French",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessonCount: 139,
        unitCount: 8,
      },
    ],
    ...partial,
  };
};

export default teachersKeyStageSubjectsFixture;
