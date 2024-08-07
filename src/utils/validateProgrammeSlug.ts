import {
  subjectSlugs,
  phaseSlugs,
  yearSlugs,
  examboardSlugs,
  keystageSlugs,
  tierSlugs,
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
  // TODO: add pathways when released

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
  } catch (e) {
    keystageSlugs.parse(yearKsSlug);
  }
};
