import { SubjectListingPageProps } from "../../../pages/beta/[viewType]/key-stages/[keyStageSlug]/subjects";

const subjectPagePropsFixture = (
  partial?: Partial<SubjectListingPageProps>
): SubjectListingPageProps => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjects: [
      [
        {
          subjectSlug: "biology",
          subjectTitle: "Biology",
          lessonCount: 4,
          programmeSlug: "biology-secondary-ks4",
          unitCount: 1,
        },
      ],
      [
        {
          subjectSlug: "chemistry",
          subjectTitle: "Chemistry",
          lessonCount: 4,
          programmeSlug: "chemistry-secondary-ks4",
          unitCount: 1,
        },
      ],
      [
        {
          subjectSlug: "citizenship",
          subjectTitle: "Citizenship",
          lessonCount: 4,
          programmeSlug: "citizenship-secondary-ks4",
          unitCount: 12,
        },
      ],
      [
        {
          subjectSlug: "combined-science",
          subjectTitle: "Combined Science",
          lessonCount: 4,
          programmeSlug: "combined-science-secondary-ks4-foundation",

          unitCount: 2,
        },
        {
          subjectSlug: "combined-science",
          subjectTitle: "Combined Science",
          lessonCount: 4,
          programmeSlug: "combined-science-secondary-ks4-higher",

          unitCount: 2,
        },
      ],
      [
        {
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 4,
          programmeSlug: "computing-secondary-ks4",
          unitCount: 15,
        },
      ],
      [
        {
          subjectSlug: "computing-non-gcse",
          subjectTitle: "Computing (Non-GCSE)",
          lessonCount: 4,
          programmeSlug: "computing-non-gcse-secondary-ks4",
          unitCount: 4,
        },
      ],
      [
        {
          subjectSlug: "french",
          subjectTitle: "French",
          lessonCount: 4,
          programmeSlug: "french-secondary-ks4",
          unitCount: 8,
        },
      ],
      [
        {
          subjectSlug: "german",
          subjectTitle: "German",
          lessonCount: 4,
          programmeSlug: "german-secondary-ks4",
          unitCount: 8,
        },
      ],
      [
        {
          subjectSlug: "latin",
          subjectTitle: "Latin",
          lessonCount: 4,
          programmeSlug: "latin-secondary-ks4",
          unitCount: 4,
        },
      ],
      [
        {
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCount: 4,
          programmeSlug: "maths-secondary-ks4-core",

          unitCount: 61,
        },
        {
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCount: 4,
          programmeSlug: "maths-secondary-ks4-foundation",
          unitCount: 63,
        },
        {
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCount: 4,
          programmeSlug: "maths-secondary-ks4-higher",

          unitCount: 63,
        },
      ],
      [
        {
          subjectSlug: "religious-education",
          subjectTitle: "Religious Education",
          lessonCount: 4,
          programmeSlug: "religious-education-secondary-ks4",
          unitCount: 10,
        },
      ],
      [
        {
          subjectSlug: "rshe-pshe",
          subjectTitle: "RSHE (PSHE)",
          lessonCount: 4,
          programmeSlug: "rshe-pshe-secondary-ks4",
          unitCount: 13,
        },
      ],
      [
        {
          subjectSlug: "spanish",
          subjectTitle: "Spanish",
          lessonCount: 4,
          programmeSlug: "spanish-secondary-ks4",
          unitCount: 8,
        },
      ],
    ],
    subjectsUnavailable: [
      [
        {
          subjectSlug: "art",
          subjectTitle: "Art & Design",
          lessonCount: 4,
          programmeSlug: "art-secondary-ks4",
          unitCount: 0,
        },
      ],
      [
        {
          subjectSlug: "english",
          subjectTitle: "English",
          lessonCount: 4,
          programmeSlug: "english-secondary-ks4",
          unitCount: 0,
        },
      ],
    ],
    ...partial,
  };
};

export const subjectCardListemProps = subjectPagePropsFixture().subjects;

export default subjectPagePropsFixture;
