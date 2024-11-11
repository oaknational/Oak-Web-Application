import { kebabCase } from "lodash";

import { GroupedUnitsSchema, SubjectCategory } from "../unitListing.schema";

// category icons don't have a consistent naming convention
const subjectCategoryIconMap = {
  Grammar: "subject-english-grammar",
  Handwriting: "subject-english-handwriting",
  "Reading, writing & oracy": "subject-english-reading-writing-oracy",
  Spelling: "subject-english-spelling",
  Vocabulary: "subject-english-vocabulary",
  Physics: "subject-physics",
  Biology: "subject-biology",
  Chemistry: "subject-chemistry",
};
export type SubjectCategoryKeys = keyof typeof subjectCategoryIconMap;

const getUniqueSubjectCategoryLabels = (
  units: GroupedUnitsSchema,
): Set<string> => {
  const uniqueSCs = new Set<string>();
  // flatter the data structure
  units.flat().forEach((unit) => {
    if (unit.subjectCategories) {
      unit.subjectCategories.forEach((sc) => {
        uniqueSCs.add(sc.label);
      });
    }
  });

  return uniqueSCs;
};

const generateCategoryObjects = (
  uniqueCategories: Set<string>,
): SubjectCategory[] => {
  const categories: SubjectCategory[] = [];
  uniqueCategories.forEach((category) => {
    const categoryKey = category as SubjectCategoryKeys;
    categories.push({
      label: category,
      iconName: subjectCategoryIconMap[categoryKey],
      slug: kebabCase(category),
    });
  });
  return categories;
};

export const getAllCategories = (
  units: GroupedUnitsSchema,
): SubjectCategory[] => {
  const uniqueCategories = getUniqueSubjectCategoryLabels(units);
  const categories = generateCategoryObjects(uniqueCategories);
  return categories.sort((a, b) => a.label.localeCompare(b.label));
};
