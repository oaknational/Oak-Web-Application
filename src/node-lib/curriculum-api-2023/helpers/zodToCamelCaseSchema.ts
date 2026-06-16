import { z, type ZodType } from "zod";
import {
  keysToCamelCase,
  keysToSnakeCase,
  type ZodContribKeysToCamel,
} from "zod-to-camel-case";

type Options = {
  bidirectional?: boolean;
};

export const zodToCamelCaseSchema = <T extends ZodType>(
  schema: T,
  { bidirectional = false }: Options = {},
) => {
  return z
    .preprocess(
      (input) => (bidirectional ? keysToSnakeCase(input) : input),
      schema,
    )
    .transform((data) => keysToCamelCase(data)) as z.ZodType<
    ZodContribKeysToCamel<z.infer<T>>
  >;
};
