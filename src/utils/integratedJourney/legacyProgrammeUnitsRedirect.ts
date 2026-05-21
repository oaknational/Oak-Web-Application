import { resolveOakHref } from "@/common-lib/urls";
import type { UrlQueryObject } from "@/common-lib/urls/createQueryStringFromObject";
import {
  getTeacherSubjectPhaseSlug,
  isProgrammeSlug,
  parseProgrammeSlug,
} from "@/utils/curriculum/slugs";

function searchParamsToQuery(params: URLSearchParams): UrlQueryObject {
  const query: UrlQueryObject = {};
  params.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}

const LEGACY_UNITS_PATH =
  /^\/teachers\/programmes\/(?<programmeSlug>[^/]+)\/units\/?$/;

export function getLegacyProgrammeSlugFromPathname(
  pathname: string,
): string | null {
  const slug = LEGACY_UNITS_PATH.exec(pathname)?.groups?.programmeSlug;
  // The path shape matches both programme slugs (e.g. citizenship-secondary-ks3) and
  // subject phase slugs (e.g. citizenship-secondary) at this URL.
  // parseSubjectPhaseSlug would accept either, so we only redirect true programme slugs.
  if (!slug || !isProgrammeSlug(slug)) {
    return null;
  }
  return slug;
}

function mapLegacySearchParams(
  out: URLSearchParams,
  searchParams: URLSearchParams,
) {
  const year = searchParams.get("year");
  if (year) {
    out.set("years", year.replace(/^year-/, ""));
  }

  const learningTheme = searchParams.get("learning-theme");
  if (learningTheme && learningTheme !== "all") {
    out.set("threads", learningTheme);
  }

  const category = searchParams.get("category");
  if (category) {
    out.set("subject_categories", category);
  }
}

export function buildIntegratedProgrammeUnitsUrl(
  programmeSlug: string,
  searchParams: URLSearchParams,
): string | null {
  const parsed = parseProgrammeSlug(programmeSlug);
  if (!parsed) {
    return null;
  }

  const subjectPhaseSlug = getTeacherSubjectPhaseSlug({
    subjectSlug: parsed.childSubjectSlug ? "science" : parsed.subjectSlug,
    phaseSlug: parsed.phaseSlug,
    examboardSlug: parsed.examboardSlug,
    pathwaySlug: parsed.pathwaySlug,
  });

  const out = new URLSearchParams();

  if (parsed.keystageSlug) {
    out.set("keystages", parsed.keystageSlug);
  }

  if (parsed.yearSlug) {
    out.set("years", parsed.yearSlug.replace(/^year-/, ""));
  }

  if (parsed.tierSlug) {
    out.set("tiers", parsed.tierSlug);
  }

  if (parsed.childSubjectSlug) {
    out.set("child_subjects", parsed.childSubjectSlug);
  }

  mapLegacySearchParams(out, searchParams);

  return resolveOakHref({
    page: "teacher-programme",
    subjectPhaseSlug,
    tab: "units",
    query: searchParamsToQuery(out),
  });
}

export function tryLegacyProgrammeUnitsRedirect(request: {
  nextUrl: { pathname: string; searchParams: URLSearchParams };
}): string | null {
  const programmeSlug = getLegacyProgrammeSlugFromPathname(
    request.nextUrl.pathname,
  );
  if (!programmeSlug) {
    return null;
  }

  return buildIntegratedProgrammeUnitsUrl(
    programmeSlug,
    request.nextUrl.searchParams,
  );
}
