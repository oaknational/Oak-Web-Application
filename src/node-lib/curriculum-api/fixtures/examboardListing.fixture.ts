import { ProgrammeListingPageData } from "../../curriculum-api-2023/queries/programmeListing/programmeListing.schema";

export const examboardProgrammeListingFixture = (
  partial?: Partial<ProgrammeListingPageData>,
): ProgrammeListingPageData => {
  return {
    keyStageSlug: "ks3",
    keyStageTitle: "Key stage 3",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    programmes: [
      {
        programmeSlug: "history-secondary-ks4-aqa",
        subjectTitle: "History",
        tierSlug: null,
        tierTitle: null,
        tierDisplayOrder: null,
        examBoardSlug: "aqa",
        examBoardTitle: "AQA",
        examBoardDisplayOrder: "1",
      },
      {
        programmeSlug: "history-secondary-ks4-edexcel",
        subjectTitle: "History",
        tierSlug: null,
        tierTitle: null,
        tierDisplayOrder: null,
        examBoardSlug: "edexcel",
        examBoardTitle: "Edexcel",
        examBoardDisplayOrder: "2",
      },
    ],

    ...partial,
  };
};
