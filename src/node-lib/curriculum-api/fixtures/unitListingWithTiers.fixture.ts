import { UnitListingData } from "..";

const unitListingWithTiers = (
  partial?: Partial<UnitListingData>
): UnitListingData => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    tierSlug: "core",
    tierTitle: "Core",
    unitCount: 20,
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
    tiers: [
      {
        tierTitle: "Foundation",
        tierSlug: "foundation",
        unitCount: 3,
        lessonCount: 34,
        programmeSlug: "maths-secondary-ks4-foundation",
      },
      {
        tierTitle: "Core",
        tierSlug: "core",
        unitCount: 3,
        lessonCount: 38,
        programmeSlug: "maths-secondary-ks4-core",
      },
      {
        tierTitle: "Higher",
        tierSlug: "higher",
        unitCount: 3,
        lessonCount: 29,
        programmeSlug: "maths-secondary-ks4-higher",
      },
    ],
    ...partial,
  };
};

export default unitListingWithTiers;
