export const LEGACY_SLUG_SUFFIX = "-l";

const isSlugLegacy = (slug: string) => {
  return slug.slice(-LEGACY_SLUG_SUFFIX.length) === LEGACY_SLUG_SUFFIX;
};

export default isSlugLegacy;
