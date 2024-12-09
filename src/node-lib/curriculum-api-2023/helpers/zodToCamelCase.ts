import { z } from "zod";

import { convertKey } from "@/utils/snakeCaseConverter";

// Recursively transform Zod schema keys from snake_case to camelCase
export const zodToCamelCase = <T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
): z.ZodTypeAny => {
  if (!(schema._def.typeName === "ZodObject")) {
    throw new Error("zodToCamelCase only works with ZodObject schemas");
  }

  const transformedShape: Record<string, z.ZodTypeAny> = {};

  Object.keys(schema.shape).forEach((key) => {
    const camelKey = convertKey(key);
    const value = schema.shape[key];
    if (value !== undefined) {
      // Recursively transform nested schemas
      transformedShape[camelKey] =
        value?._def.typeName === "ZodObject"
          ? zodToCamelCase(value as z.ZodObject<z.ZodRawShape>)
          : value;
    }
  });

  return z.object(transformedShape);
};
