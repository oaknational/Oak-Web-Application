import {
  subjectSlugs,
  phaseSlugs,
  yearSlugs,
  examboardSlugs,
  keystageSlugs,
  tierSlugs,
  pathwaySlugs,
} from "@oaknational/oak-curriculum-schema";

export const validateProgrammeSlug = (programmeSlug: string) => {
  const parts = programmeSlug.split("-");

  if (parts.at(-1) === "l") {
    parts.pop();
  }

  const phaseIndex = parts.findIndex((part) =>
    phaseSlugs._def.values.find((slug) => slug === part),
  );

  if (phaseIndex < 0) {
    throw new Error("Invalid phase slug");
  }

  const subjectSlug = parts.splice(0, phaseIndex).join("-");
  subjectSlugs.parse(subjectSlug);

  const phaseSlug = parts.splice(0, 1).join();
  phaseSlugs.parse(phaseSlug);

  // Now programme factors

  //NB. maths core tier will be accidentally parsed as a pathway but it doesn't effect the output
  const pathwayIndex = parts.findIndex((part) =>
    pathwaySlugs._def.values.find((slug) => slug === part),
  );

  if (pathwayIndex > -1) {
    const pathwaySlug = parts.splice(pathwayIndex, 1).join();
    pathwaySlugs.parse(pathwaySlug);
  }

  const tierIndex = parts.findIndex((part) =>
    tierSlugs._def.values.find((slug) => slug === part),
  );

  if (tierIndex > -1) {
    const tierSlug = parts.splice(tierIndex, 1).join();
    if (tierSlug) {
      tierSlugs.parse(tierSlug);
    }
  }

  const examboardIndex = parts.findIndex((part) =>
    examboardSlugs._def.values.find((slug) => slug === part),
  );

  if (examboardIndex > -1) {
    const examboardSlug = parts.splice(examboardIndex, 1).join();
    examboardSlugs.parse(examboardSlug);
  }

  // we should now be left with a year slug or a keystage slug
  const yearKsSlug = parts.join("-");

  try {
    yearSlugs.parse(yearKsSlug);
  } catch (_error) {
    keystageSlugs.parse(yearKsSlug);
  }
};
