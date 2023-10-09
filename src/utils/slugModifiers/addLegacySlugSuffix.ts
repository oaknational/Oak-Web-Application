import isSlugLegacy, { LEGACY_SLUG_SUFFIX } from "./isSlugLegacy";

const addLegacySlugSuffix = (slug?: string | null) => {
  if (slug) {
    return isSlugLegacy(slug) ? slug : slug + LEGACY_SLUG_SUFFIX;
  }
  return undefined;
};

export default addLegacySlugSuffix;
