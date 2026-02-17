import { TopNavResponse } from "./topNav.schema";

export const getPupilsNavData = (
  data: TopNavResponse,
  phaseSlug: "primary" | "secondary",
) => {
  const yearsByPhase = data.programmes
    .filter((programme) => programme.programme_fields.phase_slug === phaseSlug)
    .map((programme) => ({
      slug: programme.programme_fields.year_slug,
      title: programme.programme_fields.year_description,
    }))
    .filter(
      (programme, i, a) => a.findIndex((y) => y.slug === programme.slug) === i,
    )
    // sort years numerically
    .sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { numeric: true }),
    );

  return {
    slug: phaseSlug,
    title: `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}` as
      | "Primary"
      | "Secondary",
    children: yearsByPhase,
  };
};
