import { programmeFieldsFixture as programmeFieldsFixture_snake } from "@oaknational/oak-curriculum-schema";

import keysToCamelCase from "@/utils/snakeCaseConverter";
import { ProgrammeFields } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

export const programmeFieldsFixture = ({
  overrides = {},
}: { overrides?: Partial<ProgrammeFields> } = {}): ProgrammeFields => {
  return { ...keysToCamelCase(programmeFieldsFixture_snake({})), ...overrides };
};
