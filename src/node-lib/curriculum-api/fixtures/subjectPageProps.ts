import {
  KeyStagePageProps,
  ProgrammeProps,
} from "../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects";

const subjectPagePropsFixture = (
  partial?: Partial<ProgrammeProps & KeyStagePageProps>
): ProgrammeProps & KeyStagePageProps => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    programmesBySubjectAvailable: [
      [
        {
          slug: "biology",
          title: "Biology",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 1,
          activeLessonCount: 4,
          programmeSlug: "biology-secondary-ks4",
          tierSlug: null,
        },
      ],
      [
        {
          slug: "chemistry",
          title: "Chemistry",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 1,
          activeLessonCount: 4,
          programmeSlug: "chemistry-secondary-ks4",
          tierSlug: null,
        },
      ],
      [
        {
          slug: "citizenship",
          title: "Citizenship",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 12,
          activeLessonCount: 4,
          programmeSlug: "citizenship-secondary-ks4",
          tierSlug: null,
        },
      ],
      [
        {
          slug: "combined-science",
          title: "Combined Science",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 2,
          activeLessonCount: 4,
          programmeSlug: "combined-science-secondary-ks4-foundation",
          tierSlug: "foundation",
        },
        {
          slug: "combined-science",
          title: "Combined Science",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 2,
          activeLessonCount: 4,
          programmeSlug: "combined-science-secondary-ks4-higher",
          tierSlug: "higher",
        },
      ],
      [
        {
          slug: "computing",
          title: "Computing",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 15,
          activeLessonCount: 4,
          programmeSlug: "computing-secondary-ks4",
          tierSlug: null,
        },
      ],
      [
        {
          slug: "computing-non-gcse",
          title: "Computing (Non-GCSE)",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 4,
          activeLessonCount: 4,
          programmeSlug: "computing-non-gcse-secondary-ks4",
          tierSlug: null,
        },
      ],
      [
        {
          slug: "french",
          title: "French",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 8,
          activeLessonCount: 4,
          programmeSlug: "french-secondary-ks4",
          tierSlug: null,
        },
      ],
      [
        {
          slug: "german",
          title: "German",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 8,
          activeLessonCount: 4,
          programmeSlug: "german-secondary-ks4",
          tierSlug: null,
        },
      ],
      [
        {
          slug: "latin",
          title: "Latin",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 4,
          activeLessonCount: 4,
          programmeSlug: "latin-secondary-ks4",
          tierSlug: null,
        },
      ],
      [
        {
          slug: "maths",
          title: "Maths",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 61,
          activeLessonCount: 4,
          programmeSlug: "maths-secondary-ks4-core",
          tierSlug: "core",
        },
        {
          slug: "maths",
          title: "Maths",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 63,
          activeLessonCount: 4,
          programmeSlug: "maths-secondary-ks4-foundation",
          tierSlug: "foundation",
        },
        {
          slug: "maths",
          title: "Maths",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 63,
          activeLessonCount: 4,
          programmeSlug: "maths-secondary-ks4-higher",
          tierSlug: "higher",
        },
      ],
      [
        {
          slug: "religious-education",
          title: "Religious Education",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 10,
          activeLessonCount: 4,
          programmeSlug: "religious-education-secondary-ks4",
          tierSlug: null,
        },
      ],
      [
        {
          slug: "rshe-pshe",
          title: "RSHE (PSHE)",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 13,
          activeLessonCount: 4,
          programmeSlug: "rshe-pshe-secondary-ks4",
          tierSlug: null,
        },
      ],
      [
        {
          slug: "spanish",
          title: "Spanish",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 8,
          activeLessonCount: 4,
          programmeSlug: "spanish-secondary-ks4",
          tierSlug: null,
        },
      ],
    ],
    programmesBySubjectUnavailable: [
      [
        {
          slug: "art",
          title: "Art & Design",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 0,
          activeLessonCount: 4,
          programmeSlug: "art-secondary-ks4",
          tierSlug: null,
        },
      ],
      [
        {
          slug: "english",
          title: "English",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 0,
          activeLessonCount: 4,
          programmeSlug: "english-secondary-ks4",
          tierSlug: null,
        },
      ],
    ],
    ...partial,
  };
};

export const subjectCardListemProps =
  subjectPagePropsFixture().programmesBySubjectAvailable;

export default subjectPagePropsFixture;
