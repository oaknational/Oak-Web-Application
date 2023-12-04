import { LessonContentItem, UnitContentItem } from "./SearchDropdown";

export const unitListData: UnitContentItem[] = [
  {
    type: "unit",
    unitTitle: "Unit 1",
    unitSlug: "unit-1",
    programmeSlug: "test-unit-aqa",
    examboardTitle: "AQA",
  },
  {
    type: "unit",
    unitTitle: "Unit 1",
    unitSlug: "unit-1",
    programmeSlug: "test-unit-aqa-higher",
    examboardTitle: "AQA",
    tierTitle: "Higher",
  },
  {
    type: "unit",
    unitTitle: "Unit 1 Edexcel Foundation",
    unitSlug: "unit-1",
    programmeSlug: "test-unit-edexcel-foundation",
    examboardTitle: "Edexcel",
    tierTitle: "Foundation",
  },
  {
    type: "unit",
    unitTitle: "Unit 1 Eduqas",
    unitSlug: "unit-1",
    programmeSlug: "test-unit-eduqas-core",
    examboardTitle: "Eduqas",
    tierTitle: "Core",
  },
];

export const lessonListData: LessonContentItem[] = [
  {
    type: "lesson",
    lessonTitle: "Lesson 1",
    lessonSlug: "lesson-1",
    unitSlug: "unit-1",
    programmeSlug: "test-unit-aqa",
    examboardTitle: "AQA",
  },
  {
    type: "lesson",
    lessonTitle: "Lesson 1",
    lessonSlug: "lesson-1",
    unitSlug: "unit-1-aqa",
    programmeSlug: "test-unit-aqa-higher",
    examboardTitle: "AQA",
    tierTitle: "Higher",
  },
  {
    type: "lesson",
    lessonTitle: "Lesson 1",
    lessonSlug: "lesson-1",
    unitSlug: "unit-1",
    programmeSlug: "test-unit-ocr-core",
    examboardTitle: "OCR",
    tierTitle: "Core",
  },
  {
    type: "lesson",
    lessonTitle: "Lesson 1",
    lessonSlug: "lesson-1",
    unitSlug: "unit-1",
    programmeSlug: "test-unit-eduqas-foundation",
    examboardTitle: "Eduqas",
    tierTitle: "Foundation",
  },
];
