import isSlugEYFS from "./isSlugEYFS";
import isSlugLegacy from "./isSlugLegacy";

const isSlugLegacyOrEYFS = (slug: string) => {
  return isSlugLegacy(slug) && !isSlugEYFS(slug);
};

export default isSlugLegacyOrEYFS;
