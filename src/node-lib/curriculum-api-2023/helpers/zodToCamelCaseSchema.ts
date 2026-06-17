import { z, type ZodType } from "zod";
import {
  keysToCamelCase,
  keysToSnakeCase,
  type ZodContribKeysToCamel,
} from "zod-to-camel-case";

type Options = {
  bidirectional?: boolean;
};

const snakeToCamelCase = (str: string) => {
  return str.replace(/([^_])_+([a-z0-9])/gi, (_, before, char) => {
    return before + char.toUpperCase();
  });
};

export const zodToCamelCaseSchema = <T extends ZodType>(
  schema: T,
  { bidirectional = false }: Options = {},
) => {
  return z.unknown().transform((input, ctx) => {
    const result = schema.safeParse(
      bidirectional ? keysToSnakeCase(input) : input,
    );

    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({
          ...issue,
          path: bidirectional
            ? issue.path.map((segment) =>
                typeof segment === "string"
                  ? snakeToCamelCase(segment)
                  : segment,
              )
            : issue.path,
        });
      }

      return z.NEVER;
    }

    return keysToCamelCase(result.data);
  }) as z.ZodType<ZodContribKeysToCamel<z.infer<T>>>;
};
