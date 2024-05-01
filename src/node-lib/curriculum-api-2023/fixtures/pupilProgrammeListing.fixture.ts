import { programmeFieldsFixture } from "./programmeFields.fixture";

import {
  ProgrammeFields,
  PupilProgrammeListingData,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

const overrides: Partial<ProgrammeFields>[] = [
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

const programmeFields = overrides.map((override) =>
  programmeFieldsFixture({ overrides: override }),
);

export const pupilProgrammeListingFixture = (): PupilProgrammeListingData[] =>
  programmeFields.map((programmeField) => ({
    programmeSlug: "physics-secondary-year-11",
    programmeFields: programmeField,
    yearSlug: "year-11",
  }));
