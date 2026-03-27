import {
  ProgrammeFieldsCamel,
  programmeFieldsFixture as programmeFieldsFixture_snake,
} from "@oaknational/oak-curriculum-schema";
import { keysToCamelCase } from "zod-to-camel-case";

export const programmeFieldsFixture = ({
  overrides = {},
}: {
  overrides?: Partial<ProgrammeFieldsCamel>;
} = {}): ProgrammeFieldsCamel => {
  return { ...keysToCamelCase(programmeFieldsFixture_snake({})), ...overrides };
};
