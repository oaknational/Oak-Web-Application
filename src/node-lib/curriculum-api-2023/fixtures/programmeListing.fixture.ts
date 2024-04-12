import { ProgrammeListingPageData } from "../../curriculum-api-2023/queries/programmeListing/programmeListing.schema";

export const programmeListingFixture = (
  partial?: Partial<ProgrammeListingPageData>,
): ProgrammeListingPageData => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths-l",
    subjectTitle: "Maths",
    legacy: false,
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

export default programmeListingFixture;
