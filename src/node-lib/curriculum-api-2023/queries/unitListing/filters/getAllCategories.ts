import { SyntheticUnitvariantLessons } from "@oaknational/oak-curriculum-schema";
import { kebabCase } from "lodash";

type Category = {
  label: string;
  iconName: string;
  slug: string;
};

// category icons don't have a consistent naming convention
const categoryIconMap = {
  Grammar: "subject-english-grammar",
  Handwriting: "subject-english-handwriting",
  "Reading, writing & oracy": "subject-english-reading-writing-oracy",
  Spelling: "subject-english-spelling",
  Vocabulary: "subject-english-vocabulary",
  Physics: "subject-physics",
  Biology: "subject-biology",
  Chemistry: "subject-chemistry",
};
export type CategoryKeys = keyof typeof categoryIconMap;

const filterUniqueCategories = (
  parsedRawUnits: SyntheticUnitvariantLessons[],
): Set<string> => {
  const uniqueCategories = new Set<string>();
  parsedRawUnits.forEach((unit) => {
    if (unit.unit_data.subjectcategories) {
      (unit.unit_data.subjectcategories as CategoryKeys[]).forEach(
        (category) => {
          if (typeof category === "string") {
            uniqueCategories.add(category);
          }
        },
      );
    }
  });
  return uniqueCategories;
};

const generateCategoryObjects = (uniqueCategories: Set<string>): Category[] => {
  const categories: Category[] = [];
  uniqueCategories.forEach((category) => {
    const categoryKey = category as CategoryKeys;
    categories.push({
      label: category,
      iconName: categoryIconMap[categoryKey],
      slug: kebabCase(category),
    });
  });
  return categories;
};

export const getAllCategories = (
  parsedRawUnits: SyntheticUnitvariantLessons[],
): Category[] => {
  const uniqueCategories = filterUniqueCategories(parsedRawUnits);
  const categories = generateCategoryObjects(uniqueCategories);
  return categories.sort((a, b) => a.label.localeCompare(b.label));
};
