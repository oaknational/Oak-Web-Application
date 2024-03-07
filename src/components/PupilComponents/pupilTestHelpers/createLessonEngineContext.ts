import {
  LessonEngineContextType,
  allLessonReviewSections,
} from "@/components/PupilComponents/LessonEngineProvider";

export function createLessonEngineContext(
  overrides?: Partial<LessonEngineContextType>,
): NonNullable<LessonEngineContextType> {
  return {
    lessonStarted: false,
    isLessonComplete: false,
    currentSection: "starter-quiz",
    sectionResults: {},
    lessonReviewSections: allLessonReviewSections,
    completeSection: jest.fn(),
    updateCurrentSection: jest.fn(),
    proceedToNextSection: jest.fn(),
    updateSectionResult: jest.fn(),
    ...overrides,
  };
}
