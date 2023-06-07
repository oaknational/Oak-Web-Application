import { ProgrammeListingPaths } from "..";

const programmeListingPathsFixture = (
  partial?: Partial<ProgrammeListingPaths>
): ProgrammeListingPaths => {
  return {
    programmes: [
      {
        subjectSlug: "maths",
        keyStageSlug: "ks4",
      },
      {
        subjectSlug: "combined-science",
        keyStageSlug: "ks4",
      },
    ],
    ...partial,
  };
};

export default programmeListingPathsFixture;