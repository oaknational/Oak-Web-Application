import { programmeFieldsFixture } from "./programmeFields.fixture";

import {
  ProgrammeFields,
  PupilProgrammeListingData,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

const examboardOverrides: Partial<ProgrammeFields>[] = [
  {
    examboard: "AQA",
    examboardSlug: "aqa",
    examboardDisplayOrder: 1,
  },
  {
    examboard: "Edexcel",
    examboardSlug: "edexcel",
    examboardDisplayOrder: 2,
  },
];

const pathwayOverrides: Partial<ProgrammeFields>[] = [
  {
    pathway: "Core",
    pathwaySlug: "core",
    pathwayDisplayOrder: 1,
  },
  {
    pathway: "GCSE",
    pathwaySlug: "gcse",
    pathwayDisplayOrder: 2,
  },
];

const tierOverrides: Partial<ProgrammeFields>[] = [
  {
    tier: "foundation",
    tierSlug: "foundation",
    tierDescription: "Foundation",
    tierDisplayOrder: 1,
  },
  {
    tier: "higher",
    tierSlug: "higher",
    tierDescription: "Higher",
    tierDisplayOrder: 3,
  },
];

const programmeFieldsEBs = examboardOverrides.map((override) =>
  programmeFieldsFixture({ overrides: override }),
);

export const pupilProgrammeListingFixtureEBs =
  (): PupilProgrammeListingData[] =>
    programmeFieldsEBs.map((programmeField) => ({
      programmeSlug: "physics-secondary-year-11",
      programmeFields: programmeField,
      yearSlug: "year-11",
    }));

const programmeFieldsEBsTiers = tierOverrides
  .map((override) =>
    programmeFieldsEBs.map((programme) => ({ ...programme, ...override })),
  )
  .flat();

export const pupilProgrammeListingFixtureEBsTiers =
  (): PupilProgrammeListingData[] =>
    programmeFieldsEBsTiers.map((programmeField) => ({
      programmeSlug: "physics-secondary-year-11",
      programmeFields: programmeField,
      yearSlug: "year-11",
    }));

const programmeFieldsEBsPathways = pathwayOverrides
  .map((override) => {
    if (override.pathway === "Core") {
      return programmeFieldsFixture({ overrides: override });
    }
    return programmeFieldsEBs.map((programme) => ({
      ...programme,
      ...override,
    }));
  })
  .flat();

export const pupilProgrammeListingFixturePathwaysEBs =
  (): PupilProgrammeListingData[] =>
    programmeFieldsEBsPathways.map((programmeField) => ({
      programmeSlug: "physics-secondary-year-11",
      programmeFields: programmeField,
      yearSlug: "year-11",
    }));
