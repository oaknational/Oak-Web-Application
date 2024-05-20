import { UnitData } from "../units/units.schema";

import { LearningThemes } from "./threads.schema";

export const getAllLearningThemes = (units: Array<Array<UnitData>>) => {
  return units
    .flat()
    .reduce((acc, unit) => {
      unit.learningThemes?.forEach((theme) => {
        if (!acc.find((t) => t.themeSlug === theme.themeSlug)) {
          acc.push(theme);
        }
      });
      return acc;
    }, [] as LearningThemes)
    .sort((a, b) => (a.themeTitle > b.themeTitle ? 1 : -1));
};
