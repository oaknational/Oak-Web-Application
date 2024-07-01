import { z } from "zod";

import {
  getCookiesWithSchema,
  getCookiesWithSchemaOpts,
} from "./getCookiesWithSchema";

const PRERELEASE_FLAG_SCHEMA = z.boolean();
export function getPrereleaseFlag(
  key: string,
  opts?: Omit<getCookiesWithSchemaOpts<typeof PRERELEASE_FLAG_SCHEMA>, "dflt">,
) {
  return getCookiesWithSchema(
    `prerelease.${key}.enabled`,
    PRERELEASE_FLAG_SCHEMA,
    { ...opts, dflt: false },
  );
}
