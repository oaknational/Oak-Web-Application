// @ts-expect-error patch needed for ts error
import oakZodToCamelCase from "zod-to-camel-case";
import { z } from "zod";

// Recursively transform Zod schema keys from snake_case to camelCase
export const zodToCamelCase = <T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
): z.ZodType => {
  return oakZodToCamelCase(schema) as unknown as z.ZodType;
};
