import { ProgrammeListingPageData } from "../../curriculum-api-2023/queries/programmeListing/programmeListing.schema";

export const programmeListingFixture = (
  partial?: Partial<ProgrammeListingPageData>,
): ProgrammeListingPageData => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key Stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    pathwayTitle: null,
    legacy: false,
    programmes: [
      {
        programmeSlug: "maths-secondary-ks4-foundation-l",
        subjectTitle: "Maths",
        tierSlug: "foundation",
        tierTitle: "Foundation",
        tierDisplayOrder: 1,
        examBoardSlug: null,
        examBoardTitle: null,
        examBoardDisplayOrder: null,
        pathwayDisplayOrder: null,
        pathwaySlug: null,
        pathwayTitle: null,
      },
      {
        programmeSlug: "maths-secondary-ks4-higher-l",
        subjectTitle: "Maths",
        tierSlug: "higher",
        tierTitle: "Higher",
        tierDisplayOrder: 3,
        examBoardSlug: null,
        examBoardTitle: null,
        examBoardDisplayOrder: null,
        pathwayDisplayOrder: null,
        pathwaySlug: null,
        pathwayTitle: null,
      },
    ],
    ...partial,
  };
};

export const programmeListingWithPathwayFixture = (
  partial?: Partial<ProgrammeListingPageData>,
): ProgrammeListingPageData => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key Stage 4",
    subjectSlug: "citizenship",
    subjectTitle: "Citizenship",
    pathwayTitle: "Core",
    legacy: false,
    programmes: [
      {
        programmeSlug: "citizenship-secondary-ks4-core",
        subjectTitle: "Citizenship",
        tierSlug: null,
        tierTitle: null,
        tierDisplayOrder: 1,
        examBoardSlug: null,
        examBoardTitle: null,
        examBoardDisplayOrder: null,
        pathwayDisplayOrder: null,
        pathwaySlug: "core",
        pathwayTitle: "Core",
      },
    ],
    ...partial,
  };
};

export const generatedLegacyProgrammeData = {
  keyStageSlug: "ks4",
  keyStageTitle: "Key stage 4",
  subjectSlug: "maths-l",
  subjectTitle: "Maths",
  programmes: [
    {
      programmeSlug: "maths-secondary-ks4-foundation-l",
      subjectTitle: "Maths",
      tierSlug: "foundation",
      tierTitle: "Foundation",
      tierDisplayOrder: "1",
      examBoardSlug: null,
      examBoardTitle: null,
      examBoardDisplayOrder: null,
    },
    {
      programmeSlug: "maths-secondary-ks4-higher-l",
      subjectTitle: "Maths",
      tierSlug: "higher",
      tierTitle: "Higher",
      tierDisplayOrder: "3",
      examBoardSlug: null,
      examBoardTitle: null,
      examBoardDisplayOrder: null,
    },
  ],
};

export const examBoardProgrammeListingFixture = (
  partial?: Partial<ProgrammeListingPageData>,
): ProgrammeListingPageData => {
  return {
    keyStageSlug: "ks3",
    keyStageTitle: "Key Stage 3",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    pathwayTitle: null,
    legacy: false,
    programmes: [
      {
        programmeSlug: "history-secondary-ks4-aqa",
        subjectTitle: "History",
        tierSlug: null,
        tierTitle: null,
        tierDisplayOrder: null,
        examBoardSlug: "aqa",
        examBoardTitle: "AQA",
        examBoardDisplayOrder: 1,
        pathwayDisplayOrder: null,
        pathwaySlug: null,
        pathwayTitle: null,
      },
      {
        programmeSlug: "history-secondary-ks4-edexcel",
        subjectTitle: "History",
        tierSlug: null,
        tierTitle: null,
        tierDisplayOrder: null,
        examBoardSlug: "edexcel",
        examBoardTitle: "Edexcel",
        examBoardDisplayOrder: 2,
        pathwayDisplayOrder: null,
        pathwaySlug: null,
        pathwayTitle: null,
      },
    ],

    ...partial,
  };
};

export default programmeListingFixture;
