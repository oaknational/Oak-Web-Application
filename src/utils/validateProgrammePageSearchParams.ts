import { keystageSlugs, years } from "@oaknational/oak-curriculum-schema";
import type { ReadonlyURLSearchParams } from "next/navigation";
import type { ZodEnum } from "zod";

// We want to validate these values because they are used to create the heading and metatitle on the page
const paramsToValidate = [
  { name: "years", schema: years },
  { name: "keystages", schema: keystageSlugs },
];

const validateValue = (
  value: string | string[] | undefined | null,
  schema: ZodEnum,
): string | undefined => {
  if (!value || Array.isArray(value)) return;
  try {
    schema.parse(value);
    return value;
  } catch {
    return;
  }
};

export const validateSearchParams = (
  searchParams: ReadonlyURLSearchParams | null,
) => {
  return Object.fromEntries(
    paramsToValidate.map((p) => [
      p.name,
      validateValue(searchParams?.get(p.name), p.schema),
    ]),
  );
};

export const validateServerSearchParams = (
  params: Record<string, string | string[] | undefined>,
) => {
  return Object.fromEntries(
    paramsToValidate.map((p) => [
      p.name,
      validateValue(params[p.name], p.schema),
    ]),
  );
};
