import { vi } from "vitest";

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
    completeActivity: vi.fn(),
    updateCurrentSection: vi.fn(),
    proceedToNextSection: vi.fn(),
    updateSectionResult: vi.fn(),
    updateWorksheetDownloaded: vi.fn(),
    updateAdditionalFilesDownloaded: vi.fn(),
    ...overrides,
  };
}
