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
    timeStamp: { section: "overview", time: 0 },
    lessonReviewSections: allLessonReviewSections,
    completeActivity: jest.fn(),
    updateCurrentSection: jest.fn(),
    proceedToNextSection: jest.fn(),
    updateSectionResult: jest.fn(),
    updateWorksheetDownloaded: jest.fn(),
    updateAdditionalFilesDownloaded: jest.fn(),
    ...overrides,
  };
}
