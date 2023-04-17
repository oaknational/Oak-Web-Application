import { UnitListingData } from "..";

const unitListingFixture = (
  partial?: Partial<UnitListingData>
): UnitListingData => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    tierSlug: "core",
    tierTitle: "Core",
    totalUnitCount: 20,
    activeLessonCount: 40,
    units: [
      {
        slug: "some-unit-slug",
        title: "Unit title",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        themeSlug: "some-theme-slug",
        themeTitle: "Some theme title",
        lessonCount: 18,
        quizCount: 1,
        unitStudyOrder: 1,
        year: "Year 7",
        expired: false,
        expiredLessonCount: null,
      },
    ],
    ...partial,
  };
};

export default unitListingFixture;
