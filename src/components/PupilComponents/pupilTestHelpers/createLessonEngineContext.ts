import {
  LessonEngineContextType,
  allLessonReviewSections,
} from "@/components/PupilComponents/LessonEngineProvider";

export function createLessonEngineContext(
  overrides?: Partial<LessonEngineContextType>,
): NonNullable<LessonEngineContextType> {
  return {
    isLessonComplete: false,
    currentSection: "starter-quiz",
    sectionResults: {},
    lessonReviewSections: allLessonReviewSections,
    completeSection: jest.fn(),
    updateCurrentSection: jest.fn(),
    proceedToNextSection: jest.fn(),
    updateQuizResult: jest.fn(),
    ...overrides,
  };
}
