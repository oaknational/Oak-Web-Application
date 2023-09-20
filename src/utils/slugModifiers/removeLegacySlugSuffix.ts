import isSlugLegacy from "./isSlugLegacy";

const removeLegacySlugSuffix = (slug: string) => {
  return isSlugLegacy(slug) ? slug.slice(0, -2) : slug;
};

export default removeLegacySlugSuffix;
