import { z } from "zod";

export class ErrorInvalidJson extends Error {
  constructor(key: string) {
    super(`Not valid JSON at key '${key}'`);
  }
}

export class ErrorNoData extends Error {
  constructor(key: string) {
    super(`No data in localStorage at key '${key}'`);
  }
}

export type getLocalstorageWithSchemaOpts = {
  disableLogging?: boolean;
};
export function getLocalstorageWithSchema<Schema extends z.ZodTypeAny>(
  key: string,
  schema: Schema,
): z.infer<Schema> {
  let value: unknown;
  const valueRaw = localStorage.getItem(key);
  if (valueRaw === null) {
    throw new ErrorNoData(key);
  }

  try {
    value = JSON.parse(valueRaw);
  } catch (_error) {
    throw new ErrorInvalidJson(key);
  }

  const results = schema.safeParse(value);
  if (!results.success) {
    throw results.error;
  }
  const out = results.data as z.infer<Schema>;
  return out!;
}

export function getNullableLocalstorageWithSchema<Schema extends z.ZodTypeAny>(
  key: string,
  schema: Schema,
): z.infer<Schema> | undefined {
  let value: unknown;
  const valueRaw = localStorage.getItem(key);
  if (valueRaw === null) {
    return undefined;
  }

  try {
    value = JSON.parse(valueRaw);
  } catch (_error) {
    throw new ErrorInvalidJson(key);
  }

  const results = schema.safeParse(value);
  if (!results.success) {
    throw results.error;
  }
  const out = results.data as z.infer<Schema>;
  return out!;
}

export function setLocalstorageWithSchema<
  Schema extends z.ZodTypeAny,
  DataType extends z.infer<Schema> | undefined,
>(key: string, schema: Schema, data: DataType) {
  const results = schema.safeParse(data);
  if (results.success) {
    localStorage.setItem(key, JSON.stringify(results.data));
  } else {
    throw results.error;
  }
}
