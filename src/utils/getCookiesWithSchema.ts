import Cookies from "js-cookie";
import { z } from "zod";

export type getCookiesWithSchemaOpts<T> = {
  dflt?: T;
  disableLogging?: boolean;
};
export function getCookiesWithSchema<
  Schema extends z.ZodTypeAny,
  Default extends z.infer<Schema> | undefined,
>(
  key: string,
  schema: Schema,
  opts?: getCookiesWithSchemaOpts<Default>,
): z.infer<Schema> | Default {
  const { dflt, disableLogging } = opts ?? {};
  let cookieValue: unknown;
  const cookieValueRaw = Cookies.get(key);
  if (cookieValueRaw === undefined) {
    return dflt;
  }
  try {
    cookieValue = JSON.parse(cookieValueRaw);
  } catch (err) {
    return dflt;
  }

  const results = schema.safeParse(cookieValue);
  if (results.success) {
    return results.data as z.infer<Schema>;
  } else if (!disableLogging) {
    console.log(`cookie '${key}' of invalid format`, results.error);
  }
  return dflt;
}
