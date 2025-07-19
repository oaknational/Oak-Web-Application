/**
 * Centralised URL builders for curriculum-related API endpoints
 */

export function createCurriculumDownloadsUrl(
  state: "new" | "published",
  mvRefreshTime: number,
  subjectSlug: string,
  phaseSlug: string,
  ks4OptionSlug: string | null,
  tierSlug: string | null,
  childSubjectSlug: string | null,
) {
  const query = new URLSearchParams({
    mvRefreshTime: String(mvRefreshTime),
    subjectSlug: subjectSlug,
    phaseSlug: phaseSlug,
    state: state,
  });
  ks4OptionSlug && query.set("ks4OptionSlug", ks4OptionSlug);
  tierSlug && tierSlug !== null && query.set("tierSlug", tierSlug);
  childSubjectSlug &&
    childSubjectSlug !== null &&
    query.set("childSubjectSlug", childSubjectSlug);

  return `/api/curriculum-downloads/?${query}`;
}
