/**
 * Redirects programme slugs (e.g. `citizenship-secondary-ks3`) to the
 * integrated teacher programme units page, with filters expressed as query params.
 */
import { permanentRedirect } from "next/navigation";

import { resolveOakHref } from "@/common-lib/urls";
import type { UrlQueryObject } from "@/common-lib/urls/createQueryStringFromObject";
import {
  getTeacherSubjectPhaseSlug,
  parseProgrammeSlug,
  type ParsedProgrammeSlug,
} from "@/utils/curriculum/slugs";

const SCIENCE_CHILD_SUBJECT_SLUGS = new Set([
  "biology",
  "chemistry",
  "physics",
  "combined-science",
]);

function firstSearchParamValue(
  value: string | string[] | null | undefined,
): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

/** Maps legacy URL search params (`year`, `learning-theme`, `category`) to filter keys. */
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

/** Builds the IJ programme URL for a programme slug. */
export function buildIntegratedProgrammeUnitsUrl(
  parsed: ParsedProgrammeSlug,
  searchParams: UrlQueryObject = {},
): string {
  // KS4 science slugs use biology/chemistry/etc. as subject; redirect maps to `science`
  const scienceChildSubjectSlug = SCIENCE_CHILD_SUBJECT_SLUGS.has(
    parsed.subjectSlug,
  )
    ? parsed.subjectSlug
    : null;

  const subjectPhaseSlug = getTeacherSubjectPhaseSlug({
    subjectSlug: scienceChildSubjectSlug ? "science" : parsed.subjectSlug,
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

  // Apply child subject filter for KS4 science slugs.
  if (scienceChildSubjectSlug) {
    query.child_subjects = scienceChildSubjectSlug;
  }

  mapLegacySearchParams(query, searchParams);

  return resolveOakHref({
    page: "teacher-programme",
    subjectPhaseSlug,
    tab: "units",
    query,
  });
}

/**
 * Returns the redirect destination for a programme slug, or `null` if the
 * slug is already a subject phase slug or invalid.
 */
export function getProgrammeSlugRedirectDestination(
  slug: string,
  searchParams: UrlQueryObject,
): string | null {
  const parsed = parseProgrammeSlug(slug);
  if (!parsed) {
    return null;
  }
  return buildIntegratedProgrammeUnitsUrl(parsed, searchParams);
}

/** Permanently redirects when `slug` is a programme slug. */
export function redirectProgrammeSlugIfNeeded(
  slug: string,
  searchParams: UrlQueryObject,
): void {
  const destination = getProgrammeSlugRedirectDestination(slug, searchParams);
  if (destination) {
    permanentRedirect(destination);
  }
}
