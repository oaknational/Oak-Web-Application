import isSlugLegacy, { LEGACY_SLUG_SUFFIX } from "./isSlugLegacy";

const removeLegacySlugSuffix = (slug: string) => {
  return isSlugLegacy(slug) ? slug.slice(0, -LEGACY_SLUG_SUFFIX.length) : slug;
};

export default removeLegacySlugSuffix;
