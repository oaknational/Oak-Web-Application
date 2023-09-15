export const LEGACY_PROGRAMME_SUFFIX = "-l";

const isProgrammeSlugLegacy = (slug: string) => {
  return slug.slice(-2) === LEGACY_PROGRAMME_SUFFIX;
};

export default isProgrammeSlugLegacy;
