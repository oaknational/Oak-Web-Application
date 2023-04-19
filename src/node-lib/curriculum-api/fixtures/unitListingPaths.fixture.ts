import { UnitListingPaths } from "..";

const unitListingPathsFixture = (
  partial?: Partial<UnitListingPaths>
): UnitListingPaths => {
  return {
    programmes: [
      {
        programmeSlug: "maths-higher-ks4",
      },
      {
        programmeSlug: "art-primary-ks1",
      },
    ],
    ...partial,
  };
};

export default unitListingPathsFixture;
