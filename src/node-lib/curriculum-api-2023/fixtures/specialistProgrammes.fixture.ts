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
        developmentalStageSlug: "early-development-1",
        developmentalStageTitle: "Early development 1",
      },
      {
        programmeSlug: "creative-arts",
        developmentalStageSlug: "creative-arts-1",
        developmentalStageTitle: "Creative arts 1",
      },
    ],

    ...partial,
  };
};
