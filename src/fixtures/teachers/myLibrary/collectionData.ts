import { CollectionData } from "@/components/TeacherViews/MyLibrary/MyLibrary";

export const generateMockCollectionData = (count: number): CollectionData => {
  return Array.from({ length: count }, (_, index) => ({
    subject: `Subject ${index + 1}`,
    subjectSlug: `subject-${index + 1}`,
    subheading: index % 2 === 0 ? `AQA foundation` : `Edexcel higher`,
    keystage: "KS4",
    keystageSlug: "ks4",
    programmeTitle:
      index === 3 ? "Programme: subcategory KS4" : `Programme ${index + 1} KS4`,
    searchQuery: null,
    uniqueProgrammeKey: `programme-${index + 1}`,
    units: [
      {
        unitSlug: `unit-${index + 1}`,
        unitTitle: `Unit ${index + 1}: Topic`,
        optionalityTitle: null,
        savedAt: new Date().toISOString(),
        unitOrder: 1,
        yearOrder: 1,
        year: `Year ${index + 1}`,
        lessons: [
          {
            slug: `lesson-${index + 1}-1`,
            title: `Lesson ${index + 1} - Part 1`,
            state: "saved",
            order: 1,
          },
          {
            slug: `lesson-${index + 1}-2`,
            title: `Lesson ${index + 1} - Part 2`,
            state: "saved",
            order: 2,
          },
        ],
      },
    ],
    programmeSlug: `programme-${index + 1}`,
  }));
};
