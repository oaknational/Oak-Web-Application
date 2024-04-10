import { UnitListingPageData } from "../queries/unitListing/unitListing.schema";

const lessonListingFixture = (
  partial?: Partial<UnitListingPageData>,
): UnitListingPageData => {
  return {
    programmeSlug: "maths-secondary-ks4-higher",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    tierSlug: null,
    totalUnitCount: 1,
    examBoardSlug: "aqa",
    examBoardTitle: "AQA",
    units: [
      [
        {
          programmeSlug: "maths-secondary-ks4-higher",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          unitStudyOrder: 1,
          expiredLessonCount: 0,
          slug: "maths",
          title: "Maths",
          cohort: "2023-2024",
          expired: false,
          yearTitle: "Year 10",
          nullTitle: "Maths",
          quizCount: null,
          themeSlug: null,
          themeTitle: null,
          lessonCount: 6,
          learningThemes: null,
        },
      ],
    ],
    tiers: [
      {
        tierSlug: "higher",
        tierTitle: "Higher",
        tierProgrammeSlug: "maths-secondary-ks4-higher",
        unitCount: 1,
        lessonCount: 6,
      },
    ],
    learningThemes: null,
    ...partial,
  };
};

export default lessonListingFixture;
