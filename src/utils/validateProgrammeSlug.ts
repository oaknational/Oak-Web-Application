import {
  subjectSlugs,
  phaseSlugs,
  yearSlugs,
  examboardSlugs,
  keystageSlugs,
  tierSlugs,
} from "@oaknational/oak-curriculum-schema";

export const validateProgrammeSlug = (programmeSlug: string) => {
  const maxExamboardLength = examboardSlugs._def.values.reduce(
    (acc, examboard) => Math.max(acc, examboard.length),
    0,
  );

  const maxTierLength = tierSlugs._def.values.reduce(
    (acc, tier) => Math.max(acc, tier.length),
    0,
  );

  const maxYearLength = yearSlugs._def.values.reduce(
    (acc, year) => Math.max(acc, year.length),
    0,
  );

  const maxKeystageLength = keystageSlugs._def.values.reduce(
    (acc, keystage) => Math.max(acc, keystage.length),
    0,
  );

  const parts = programmeSlug.split("-");
  const index = parts.findIndex((part) =>
    phaseSlugs._def.values.find((slug) => slug === part),
  );

  if (index < 0) {
    throw new Error("programmeSlug is invalid");
  }

  const subjectSlug = parts.slice(0, index).join("-");
  const phaseSlug = parts[index];
  const rest = parts.slice(index + 1).join("-");

  const trimmed = rest.replace(/-l$/, "");

  // TODO: add pathways when released
  const maxProgrammeSlugLength =
    Math.max(maxYearLength, maxKeystageLength) +
    maxExamboardLength +
    maxTierLength +
    3;

  if (trimmed.length > maxProgrammeSlugLength) {
    throw new Error(
      `programmeSlug is too long. Max length is ${maxProgrammeSlugLength}`,
    );
  }

  // NB. we've already guaranteed that the slug is not too long so this is safe to run
  // TODO: add pathways when released
  const matches =
    /^(year-\d{1,2}|ks\d|early-years-foundation-stage)-?([a-z]+)?-?([a-z]+)?$/.exec(
      trimmed,
    );

  const yearKsSlug = matches?.[1];
  const programmeFactors = [matches?.[2], matches?.[3]].filter(Boolean);

  subjectSlugs.parse(subjectSlug);
  phaseSlugs.parse(phaseSlug);
  try {
    yearSlugs.parse(yearKsSlug);
  } catch (e) {
    keystageSlugs.parse(yearKsSlug);
  }
  programmeFactors.forEach((factor) => {
    try {
      examboardSlugs.parse(factor);
    } catch (e) {
      tierSlugs.parse(factor);
    }
  });
};
