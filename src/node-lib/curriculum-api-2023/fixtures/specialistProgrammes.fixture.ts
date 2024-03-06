import { SpecialistProgrammeListingPageData } from "../queries/specialistProgrammeListing/specialistProgrammeListing.schema";

export const specialistProgrammeListingPageDataFixture = (
  partial?: Partial<SpecialistProgrammeListingPageData>,
): SpecialistProgrammeListingPageData => {
  return {
    subjectSlug: "communication-and-language",
    subjectTitle: "Communication and language",
    programmes: [
      {
        programmeSlug: "early-development",
        developmentStageSlug: "early-development-1",
        developmentStageTitle: "Early development 1",
        unitCount: 10,
        lessonCount: 100,
      },
      {
        programmeSlug: "creative-arts",
        developmentStageSlug: "creative-arts-1",
        developmentStageTitle: "Creative arts 1",
        unitCount: 10,
        lessonCount: 100,
      },
    ],

    ...partial,
  };
};
