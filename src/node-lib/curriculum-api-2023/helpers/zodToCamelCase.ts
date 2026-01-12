import _zodToCamelCase from "zod-to-camel-case";
import { z } from "zod";

// Recursively transform Zod schema keys from snake_case to camelCase
export const zodToCamelCases = <T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
): z.ZodType => {
  return _zodToCamelCase(schema);
};
