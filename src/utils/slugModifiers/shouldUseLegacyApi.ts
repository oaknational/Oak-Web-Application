import isSlugEYFS from "./isSlugEYFS";
import isSlugLegacy from "./isSlugLegacy";

const shouldUseLegacyApi = (slug: string) => {
  return isSlugLegacy(slug) && !isSlugEYFS(slug);
};

export default shouldUseLegacyApi;
