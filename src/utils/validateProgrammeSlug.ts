import {
  subjectSlugs,
  phaseSlugs,
  yearSlugs,
  examboardSlugs,
  keystageSlugs,
  tierSlugs,
} from "@oaknational/oak-curriculum-schema";

export const validateProgrammeSlug = (programmeSlug: string) => {
  const maxSubjectLength = subjectSlugs._def.values.reduce(
    (acc, subject) => Math.max(acc, subject.length),
    0,
  );

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

  const maxPhaseLength = phaseSlugs._def.values.reduce(
    (acc, phase) => Math.max(acc, phase.length),
    0,
  );

  const trimmed = programmeSlug.replace(/-l$/, "");

  console.log(trimmed);

  // TODO: add pathways when released
  const maxProgrammeSlugLength =
    maxSubjectLength +
    maxPhaseLength +
    Math.max(maxYearLength, maxKeystageLength) +
    maxExamboardLength +
    maxTierLength +
    4;

  if (trimmed.length > maxProgrammeSlugLength) {
    throw new Error(
      `programmeSlug is too long. Max length is ${maxProgrammeSlugLength}`,
    );
  }

  // TODO: add pathways when released
  const matches =
    /^([a-z-]*?)-(primary|secondary)-(year-\d{1,2}|ks\d|early-years-foundation-stage)-?([a-z]*)?-?([a-z]*)?$/.exec(
      trimmed,
    );

  const subjectSlug = matches?.[1];
  const phaseSlug = matches?.[2];
  const yearKsSlug = matches?.[3];
  const programmeFactors = [matches?.[4], matches?.[5]].filter(Boolean);

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
