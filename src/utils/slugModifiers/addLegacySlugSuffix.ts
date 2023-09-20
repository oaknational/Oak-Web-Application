import isSlugLegacy, { LEGACY_PROGRAMME_SUFFIX } from "./isSlugLegacy";

const addLegacySlugSuffix = (slug?: string | null) => {
  if (slug) {
    return isSlugLegacy(slug) ? slug : slug + LEGACY_PROGRAMME_SUFFIX;
  }
  return undefined;
};

export default addLegacySlugSuffix;
