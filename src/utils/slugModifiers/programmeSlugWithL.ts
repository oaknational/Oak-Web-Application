import isProgrammeSlugLegacy, {
  LEGACY_PROGRAMME_SUFFIX,
} from "./isProgrammeSlugLegacy";

const programmeSlugWithL = (slug?: string | null) => {
  if (slug) {
    return isProgrammeSlugLegacy(slug) ? slug : slug + LEGACY_PROGRAMME_SUFFIX;
  }
  return undefined;
};

export default programmeSlugWithL;
