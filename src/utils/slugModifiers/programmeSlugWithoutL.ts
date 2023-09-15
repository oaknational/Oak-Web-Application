import isProgrammeSlugLegacy from "./isProgrammeSlugLegacy";

const programmeSlugWithoutL = (slug: string) => {
  return isProgrammeSlugLegacy(slug) ? slug.slice(0, -2) : slug;
};

export default programmeSlugWithoutL;
