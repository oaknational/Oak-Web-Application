import { TierListingData } from "..";
import { ProgrammeListingPageData } from "../../curriculum-api-2023/queries/programmeListing/programmeListing.schema";

export const programmeListingFixture = (
  partial?: Partial<ProgrammeListingPageData>
): ProgrammeListingPageData => {
  return {
    keyStageSlug: "ks3",
    keyStageTitle: "Key stage 3",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    programmes: [
      {
        programmeSlug: "physics-secondary-ks4-foundation-aqa",
        subjectTitle: "Physics",
        unitCount: 10,
        lessonCount: 115,
        tierSlug: "foundation",
        tierTitle: "Foundation",
        tierDisplayOrder: "1",
        examBoardSlug: "aqa",
        examBoardTitle: "AQA",
        examBoardDisplayOrder: "1",
      },
      {
        programmeSlug: "physics-secondary-ks4-foundation-edexcel",
        subjectTitle: "Physics",
        unitCount: 10,
        lessonCount: 115,
        tierSlug: "foundation",
        tierTitle: "Foundation",
        tierDisplayOrder: "1",
        examBoardSlug: "edexcel",
        examBoardTitle: "Edexcel",
        examBoardDisplayOrder: "2",
      },
      {
        programmeSlug: "physics-secondary-ks4-foundation-ocr",
        subjectTitle: "Physics",
        unitCount: 10,
        lessonCount: 115,
        tierSlug: "foundation",
        tierTitle: "Foundation",
        tierDisplayOrder: "1",
        examBoardSlug: "ocr",
        examBoardTitle: "OCR",
        examBoardDisplayOrder: "3",
      },
      {
        programmeSlug: "physics-secondary-ks4-foundation",
        subjectTitle: "Physics",
        unitCount: 17,
        lessonCount: 195,
        tierSlug: "foundation",
        tierTitle: "Foundation",
        tierDisplayOrder: "1",
        examBoardSlug: null,
        examBoardTitle: null,
        examBoardDisplayOrder: null,
      },
      {
        programmeSlug: "physics-secondary-ks4-higher-aqa",
        subjectTitle: "Physics",
        unitCount: 10,
        lessonCount: 122,
        tierSlug: "higher",
        tierTitle: "Higher",
        tierDisplayOrder: "3",
        examBoardSlug: "aqa",
        examBoardTitle: "AQA",
        examBoardDisplayOrder: "1",
      },
      {
        programmeSlug: "physics-secondary-ks4-higher-edexcel",
        subjectTitle: "Physics",
        unitCount: 10,
        lessonCount: 122,
        tierSlug: "higher",
        tierTitle: "Higher",
        tierDisplayOrder: "3",
        examBoardSlug: "edexcel",
        examBoardTitle: "Edexcel",
        examBoardDisplayOrder: "2",
      },
      {
        programmeSlug: "physics-secondary-ks4-higher-ocr",
        subjectTitle: "Physics",
        unitCount: 10,
        lessonCount: 122,
        tierSlug: "higher",
        tierTitle: "Higher",
        tierDisplayOrder: "3",
        examBoardSlug: "ocr",
        examBoardTitle: "OCR",
        examBoardDisplayOrder: "3",
      },
      {
        programmeSlug: "physics-secondary-ks4-higher",
        subjectTitle: "Physics",
        unitCount: 17,
        lessonCount: 204,
        tierSlug: "higher",
        tierTitle: "Higher",
        tierDisplayOrder: "3",
        examBoardSlug: null,
        examBoardTitle: null,
        examBoardDisplayOrder: null,
      },
    ],

    ...partial,
  };
};

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
