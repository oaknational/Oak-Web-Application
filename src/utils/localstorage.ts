import { z } from "zod";

export type getLocalstorageWithSchemaOpts<T> = {
  dflt?: T;
  disableLogging?: boolean;
};
export function getLocalstorageWithSchema<
  Schema extends z.ZodTypeAny,
  Default extends z.infer<Schema> | undefined,
>(
  key: string,
  schema: Schema,
  opts: getLocalstorageWithSchemaOpts<Default> = {},
): z.infer<Schema> | Default {
  const { dflt, disableLogging } = opts;

  if (!globalThis.localStorage) {
    return dflt;
  }

  let value: unknown;
  const valueRaw = localStorage.getItem(key);
  if (valueRaw === null) {
    return dflt;
  }

  try {
    value = JSON.parse(valueRaw);
  } catch (err) {
    return dflt;
  }

  const results = schema.safeParse(value);
  if (results.success) {
    return results.data as z.infer<Schema>;
  } else if (!disableLogging) {
    console.log(
      `localStorage.getItem("${key}") of invalid format`,
      results.error,
    );
  }
  return dflt;
}

export function setLocalstorageWithSchema<
  Schema extends z.ZodTypeAny,
  Default extends z.infer<Schema> | undefined,
>(key: string, schema: Schema, data: Default) {
  const results = schema.safeParse(data);
  if (results.success) {
    localStorage.setItem(key, JSON.stringify(results.data));
  }
}
