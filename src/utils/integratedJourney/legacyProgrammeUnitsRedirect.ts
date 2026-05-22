import { permanentRedirect } from "next/navigation";

import { resolveOakHref } from "@/common-lib/urls";
import type { UrlQueryObject } from "@/common-lib/urls/createQueryStringFromObject";
import {
  getTeacherSubjectPhaseSlug,
  parseProgrammeSlug,
  type ParsedProgrammeSlug,
} from "@/utils/curriculum/slugs";

function firstSearchParamValue(
  value: string | string[] | null | undefined,
): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

function mapLegacySearchParams(
  out: UrlQueryObject,
  searchParams: UrlQueryObject,
): void {
  const year = firstSearchParamValue(searchParams.year);
  if (year) {
    out.years = year.replace(/^year-/, "");
  }

  const learningTheme = firstSearchParamValue(searchParams["learning-theme"]);
  if (learningTheme && learningTheme !== "all") {
    out.threads = learningTheme;
  }

  const category = firstSearchParamValue(searchParams.category);
  if (category) {
    out.subject_categories = category;
  }
}

export function buildIntegratedProgrammeUnitsUrl(
  parsed: ParsedProgrammeSlug,
  searchParams: UrlQueryObject = {},
): string {
  const subjectPhaseSlug = getTeacherSubjectPhaseSlug({
    subjectSlug: parsed.childSubjectSlug ? "science" : parsed.subjectSlug,
    phaseSlug: parsed.phaseSlug,
    examboardSlug: parsed.examboardSlug,
    pathwaySlug: parsed.pathwaySlug,
  });

  const query: UrlQueryObject = {};

  if (parsed.keystageSlug) {
    query.keystages = parsed.keystageSlug;
  }

  if (parsed.yearSlug) {
    query.years = parsed.yearSlug.replace(/^year-/, "");
  }

  if (parsed.tierSlug) {
    query.tiers = parsed.tierSlug;
  }

  if (parsed.childSubjectSlug) {
    query.child_subjects = parsed.childSubjectSlug;
  }

  mapLegacySearchParams(query, searchParams);

  return resolveOakHref({
    page: "teacher-programme",
    subjectPhaseSlug,
    tab: "units",
    query,
  });
}

export function getLegacyProgrammeUnitsRedirectDestination(
  slug: string,
  searchParams: UrlQueryObject,
): string | null {
  const parsed = parseProgrammeSlug(slug);
  if (!parsed) {
    return null;
  }
  return buildIntegratedProgrammeUnitsUrl(parsed, searchParams);
}

export function redirectLegacyProgrammeUnitsIfNeeded(
  slug: string,
  searchParams: UrlQueryObject,
): void {
  const destination = getLegacyProgrammeUnitsRedirectDestination(
    slug,
    searchParams,
  );
  if (destination) {
    permanentRedirect(destination);
  }
}
