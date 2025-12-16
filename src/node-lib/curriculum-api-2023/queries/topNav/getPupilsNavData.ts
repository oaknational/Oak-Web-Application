import { TopNavResponse } from "./topNav.schema";

export const getPupilsNavData = (data: TopNavResponse, phaseSlug: string) => {
  const yearsByPhase = data.teachers
    .filter((programme) => programme.programme_fields.phase_slug === phaseSlug)
    .map((programme) => ({
      slug: programme.programme_fields.year_slug,
      title: programme.programme_fields.year_description,
    }))
    .filter(
      (programme, i, a) => a.findIndex((y) => y.slug === programme.slug) === i,
    );

  return {
    phaseSlug,
    phaseTitle: `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}`,
    years: yearsByPhase,
  };
};
