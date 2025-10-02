import { z, ZodType } from "zod";

const snakeToCamel = (str: string) =>
  str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function keysToCamel<T>(obj: T): any {
  if (Array.isArray(obj)) return obj.map(keysToCamel);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [snakeToCamel(k), keysToCamel(v)]),
    );
  }
  return obj;
}

// Type-level mapping: snake_case → camelCase
type SnakeToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
  : S;

type KeysToCamel<U> =
  U extends Array<infer V>
    ? Array<KeysToCamel<V>>
    : U extends object
      ? {
          [K in keyof U as SnakeToCamel<string & K>]: KeysToCamel<U[K]>;
        }
      : U;

// Fully generic reusable function with internal type mapping
export function zodToCamelCase<T extends ZodType>(schema: T) {
  const newSchema = schema.transform((data) =>
    keysToCamel(data),
  ) as unknown as {
    parse: (input: z.infer<T>) => KeysToCamel<z.infer<T>>;
  };
  return newSchema as z.ZodType<ReturnType<typeof newSchema.parse>>;
}
