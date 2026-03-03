// @ts-expect-error patch needed for ts error
import oakZodToCamelCase from "zod-to-camel-case";
import { z } from "zod";

// Recursively transform Zod schema keys from snake_case to camelCase.
// bidirectional: true allows both snake_case and camelCase input (Zod 4 requires this
// for camelCase input since preprocess no longer passes through unrecognised keys).
export const zodToCamelCase = <T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
): z.ZodType => {
  return oakZodToCamelCase(schema, {
    bidirectional: true,
  }) as unknown as z.ZodType;
};
