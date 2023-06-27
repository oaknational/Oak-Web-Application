import { TierListingData } from "..";

const tierListingFixture = (
  partial?: Partial<TierListingData>
): TierListingData => {
  return {
    programmes: [
      {
        programmeSlug: "maths-secondary-ks4-core",
        keyStageSlug: "ks3",
        keyStageTitle: "Key stage 3",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        tierSlug: "core",
        tierTitle: "Core",
        totalUnitCount: 61,
        activeLessonCount: 284,
        activeUnitCount: 61,
      },
      {
        programmeSlug: "maths-secondary-ks4-foundation",
        keyStageSlug: "ks1",
        keyStageTitle: "Key stage 1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        tierSlug: "foundation",
        tierTitle: "Foundation",
        totalUnitCount: 63,
        activeLessonCount: 256,
        activeUnitCount: 63,
      },
      {
        programmeSlug: "maths-secondary-ks4-higher",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        tierSlug: "higher",
        tierTitle: "Higher",
        totalUnitCount: 63,
        activeLessonCount: 275,
        activeUnitCount: 63,
      },
    ],
    ...partial,
  };
};

export default tierListingFixture;
