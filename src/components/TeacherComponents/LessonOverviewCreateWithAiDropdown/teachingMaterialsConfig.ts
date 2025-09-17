import { LessonBrowseDataByKs } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export type TeachingMaterialType =
  | "additional-glossary"
  | "additional-comprehension"
  | "additional-starter-quiz"
  | "additional-exit-quiz";

// Simple configuration for specific subjects and key stages
// Only includes subjects that have restrictions
const subjectAvailableTeachingMaterialTypes: Record<
  string,
  Record<string, TeachingMaterialType[]>
> = {
  // Art
  art: {
    ks1: [
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
    ks4: [
      "additional-glossary",
      "additional-comprehension",
      "additional-starter-quiz",
    ],
  },

  // Maths - no comprehension for any key stage
  maths: {
    ks1: [
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
    ks2: [
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
    ks3: [
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
    ks4: [
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
  },

  // Science - all additional materials allowed
  science: {
    ks1: [
      "additional-glossary",
      "additional-comprehension",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
  },

  // Design and Technology - all materials allowed
  "design-technology": {
    ks1: [
      "additional-glossary",
      "additional-comprehension",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
  },

  // History - all materials allowed
  history: {
    ks1: [
      "additional-glossary",
      "additional-comprehension",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
  },

  // Religious Education - no comprehension for KS1
  "religious-education": {
    ks1: [
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
  },

  // Computing - all materials allowed
  computing: {
    ks1: [
      "additional-glossary",
      "additional-comprehension",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
  },

  // RSHE/PSHE - all materials allowed
  "rshe-pshe": {
    ks1: [
      "additional-glossary",
      "additional-comprehension",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
  },

  // Financial Education - no comprehension for any key stage
  "financial-education": {
    ks1: [
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
    ks2: [
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
    ks3: [
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
    ks4: [
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
  },

  // Modern Foreign Languages (Spanish/French/German) - starter/exit quizzes only
  spanish: {
    ks2: ["additional-starter-quiz", "additional-exit-quiz"],
    ks3: ["additional-starter-quiz", "additional-exit-quiz"],
    ks4: ["additional-starter-quiz", "additional-exit-quiz"],
  },

  french: {
    ks2: ["additional-starter-quiz", "additional-exit-quiz"],
    ks3: ["additional-starter-quiz", "additional-exit-quiz"],
    ks4: ["additional-starter-quiz", "additional-exit-quiz"],
  },

  german: {
    ks2: ["additional-starter-quiz", "additional-exit-quiz"],
    ks3: ["additional-starter-quiz", "additional-exit-quiz"],
    ks4: ["additional-starter-quiz", "additional-exit-quiz"],
  },

  // Cooking and Nutrition - all materials allowed
  "cooking-nutrition": {
    ks1: [
      "additional-glossary",
      "additional-comprehension",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
  },

  // Music - all materials allowed
  music: {
    ks1: [
      "additional-glossary",
      "additional-comprehension",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ],
  },
};

export function getTeachingMaterialTypesByCategory(
  categories: Array<string | number | null>,
): TeachingMaterialType[] | undefined {
  const subjectCategoryAvailableTeachingMaterialTypes: Record<
    string,
    TeachingMaterialType[]
  > = {
    Handwriting: ["additional-glossary", "additional-starter-quiz"],
  };

  for (const category of categories) {
    if (subjectCategoryAvailableTeachingMaterialTypes[String(category)]) {
      return subjectCategoryAvailableTeachingMaterialTypes[String(category)];
    }
  }

  return undefined;
}

const actionsAvailableTeachingMaterialTypes = (
  actions: LessonBrowseDataByKs["actions"],
): TeachingMaterialType[] | undefined => {
  if (actions?.isPePractical) {
    return ["additional-glossary"];
  }
};
export function getAvailableTeachingMaterials(
  subjectSlug: string | null,
  keyStageSlug: string | null | undefined,
  subjectCategories?: Array<string | number | null> | null,
  actions?: LessonBrowseDataByKs["actions"],
): TeachingMaterialType[] {
  // Default materials for all subjects
  const defaultMaterials: TeachingMaterialType[] = [
    "additional-glossary",
    "additional-comprehension",
    "additional-starter-quiz",
    "additional-exit-quiz",
  ];

  let availableTeachingMaterialTypes: TeachingMaterialType[] | undefined;

  if (subjectSlug && keyStageSlug) {
    availableTeachingMaterialTypes =
      subjectAvailableTeachingMaterialTypes[subjectSlug]?.[keyStageSlug];
  }

  if (subjectCategories) {
    const categoryMaterials =
      getTeachingMaterialTypesByCategory(subjectCategories);
    if (categoryMaterials) {
      availableTeachingMaterialTypes = categoryMaterials;
      console.log("AVAILABLE FROM CATEGORY", availableTeachingMaterialTypes);
    }
  }

  const actionMaterials = actionsAvailableTeachingMaterialTypes(actions);
  if (actionMaterials) {
    availableTeachingMaterialTypes = actionMaterials;
  }

  if (!availableTeachingMaterialTypes) {
    return defaultMaterials;
  }

  return availableTeachingMaterialTypes;
}
