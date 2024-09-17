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

export const getAllCategories = (
  parsedRawUnits: SyntheticUnitvariantLessons[],
): Category[] => {
  return Array.from(
    parsedRawUnits
      .reduce((acc, unit) => {
        if (!unit.unit_data.subjectcategories) {
          return acc;
        }
        (unit.unit_data.subjectcategories as CategoryKeys[]).forEach(
          (category) => {
            if (typeof category === "string" && !acc.has(category)) {
              acc.set(category, {
                label: category,
                iconName: categoryIconMap[category],
                slug: kebabCase(category),
              });
            }
          },
        );
        return acc;
      }, new Map<string, Category>())
      .values(),
  ).sort((a, b) => a.label.localeCompare(b.label));
};
