import { TopNavResponse } from "./topNav.schema";

export const getPupilsNavData = (data: TopNavResponse, phaseSlug: string) => {
  const yearsByPhase = data.programmes
    .filter((programme) => programme.programme_fields.phase_slug === phaseSlug)
    .map((programme) => ({
      slug: programme.programme_fields.year_slug,
      title: programme.programme_fields.year_description,
    }))
    .filter(
      (programme, i, a) => a.findIndex((y) => y.slug === programme.slug) === i,
    )
    .sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { numeric: true }),
    );

  return {
    phaseSlug,
    phaseTitle: `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}`,
    years: yearsByPhase,
  };
};
