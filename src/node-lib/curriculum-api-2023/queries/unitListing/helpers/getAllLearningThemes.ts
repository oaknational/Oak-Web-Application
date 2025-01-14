import { GroupedUnitsSchema, LearningThemes } from "../unitListing.schema";

export const getAllLearningThemes = (units: GroupedUnitsSchema) => {
  return units
    .flat()
    .reduce((learningThemes, unit) => {
      unit.learningThemes?.forEach((theme) => {
        if (!learningThemes.find((t) => t.themeSlug === theme.themeSlug)) {
          learningThemes.push(theme);
        }
      });
      return learningThemes;
    }, [] as LearningThemes)
    .sort((a, b) => (a.themeTitle > b.themeTitle ? 1 : -1));
};
