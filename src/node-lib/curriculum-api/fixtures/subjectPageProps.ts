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
          subjectSlug: "biology",
          subjectTitle: "Biology",
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
          subjectSlug: "chemistry",
          subjectTitle: "Chemistry",
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
          subjectSlug: "citizenship",
          subjectTitle: "Citizenship",
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
          subjectSlug: "combined-science",
          subjectTitle: "Combined Science",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 2,
          activeLessonCount: 4,
          programmeSlug: "combined-science-secondary-ks4-foundation",
          tierSlug: "foundation",
        },
        {
          subjectSlug: "combined-science",
          subjectTitle: "Combined Science",
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
          subjectSlug: "computing",
          subjectTitle: "Computing",
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
          subjectSlug: "computing-non-gcse",
          subjectTitle: "Computing (Non-GCSE)",
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
          subjectSlug: "french",
          subjectTitle: "French",
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
          subjectSlug: "german",
          subjectTitle: "German",
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
          subjectSlug: "latin",
          subjectTitle: "Latin",
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
          subjectSlug: "maths",
          subjectTitle: "Maths",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 61,
          activeLessonCount: 4,
          programmeSlug: "maths-secondary-ks4-core",
          tierSlug: "core",
        },
        {
          subjectSlug: "maths",
          subjectTitle: "Maths",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          totalUnitCount: 63,
          activeLessonCount: 4,
          programmeSlug: "maths-secondary-ks4-foundation",
          tierSlug: "foundation",
        },
        {
          subjectSlug: "maths",
          subjectTitle: "Maths",
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
          subjectSlug: "religious-education",
          subjectTitle: "Religious Education",
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
          subjectSlug: "rshe-pshe",
          subjectTitle: "RSHE (PSHE)",
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
          subjectSlug: "spanish",
          subjectTitle: "Spanish",
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
          subjectSlug: "art",
          subjectTitle: "Art & Design",
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
          subjectSlug: "english",
          subjectTitle: "English",
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
