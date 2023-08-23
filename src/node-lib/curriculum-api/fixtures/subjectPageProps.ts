import { SubjectListingPageProps } from "../../../pages/beta/[viewType]/key-stages/[keyStageSlug]/subjects";

const subjectPagePropsFixture = (
  partial?: Partial<SubjectListingPageProps>
): SubjectListingPageProps => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjects: [
      {
        subjectSlug: "biology",
        old: {
          subjectSlug: "biology",
          subjectTitle: "Biology",
          unitCount: 1,
          lessonCount: 6,
          programmeSlug: "biology-secondary-ks4",
          programmeCount: 1,
        },
        new: {
          subjectSlug: "biology",
          subjectTitle: "Biology",
          unitCount: 6,
          lessonCount: 35,
          programmeSlug: "biology-secondary-ks4-higher-aqa",
          programmeCount: 12,
        },
      },
      {
        subjectSlug: "maths",
        old: {
          subjectSlug: "maths",
          subjectTitle: "Maths",
          unitCount: 1,
          lessonCount: 6,
          programmeSlug: "maths-secondary-ks4",
          programmeCount: 2,
        },
        new: {
          subjectSlug: "maths",
          subjectTitle: "Maths",
          unitCount: 6,
          lessonCount: 35,
          programmeSlug: "biology-secondary-ks4",
          programmeCount: 1,
        },
      },
      {
        subjectSlug: "computing",
        new: {
          subjectSlug: "computing",
          subjectTitle: "Computing",
          unitCount: 6,
          lessonCount: 35,
          programmeSlug: "computing-secondary-ks4",
          programmeCount: 1,
        },
      },
      {
        subjectSlug: "music",
        old: {
          subjectSlug: "music",
          subjectTitle: "Music",
          unitCount: 6,
          lessonCount: 35,
          programmeSlug: "music-secondary-ks4",
          programmeCount: 1,
        },
      },
    ],

    ...partial,
  };
};

export const subjectCardListemProps = subjectPagePropsFixture().subjects;

export default subjectPagePropsFixture;
