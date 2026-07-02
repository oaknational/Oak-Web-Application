import { keystageSlugs, years } from "@oaknational/oak-curriculum-schema";
import { ReadonlyURLSearchParams } from "next/navigation";
import { z } from "zod";

import type { CurriculumFilters } from "@/utils/curriculum/types";

export const programmePageSearchParamsSchema = z
  .object({
    years: years.optional().catch(undefined),
    keystages: keystageSlugs.optional().catch(undefined),
  } satisfies Partial<Record<keyof CurriculumFilters, z.ZodTypeAny>>)
  // Preserve any other (non-validated) search params, keeping a
  // `string | string[] | undefined` index signature compatible with PageSearchParms.
  .catchall(z.union([z.string(), z.array(z.string())]).optional())
  // When there are no search params, or all search params are undefined, return undefined
  .transform((x) =>
    Object.keys(x).length === 0 || Object.values(x).every((value) => !value)
      ? undefined
      : x,
  );

export const validateSearchParams = (
  searchParams: ReadonlyURLSearchParams | null,
) => {
  return programmePageSearchParamsSchema.parse({
    years: searchParams?.get("years"),
    keystages: searchParams?.get("keystages"),
  });
};

export const validateServerSearchParams = (
  params: Record<string, string | string[] | undefined>,
) => {
  return programmePageSearchParamsSchema.parse(params);
};
