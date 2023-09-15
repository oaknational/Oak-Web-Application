import isProgrammeSlugLegacy from "./isProgrammeSlugLegacy";

const programmeSlugWithL = (slug?: string | null) => {
  if (slug) {
    return isProgrammeSlugLegacy(slug) ? slug : slug + "-l";
  }
  return undefined;
};

export default programmeSlugWithL;
