import {
  IntroResult,
  LessonReviewSection,
  LessonSectionResults,
  PupilLessonProgressDataState,
  PupilLessonProgressState,
  QuizResult,
  VideoResult,
} from "./pupilLessonProgressTypes";

/**
 * Creates the serialisable baseline data for a lesson run.
 * This is reused for first load and explicit reset.
 * @returns Baseline lesson progress data state.
 */
export const getDefaultLessonProgressState =
  (): PupilLessonProgressDataState => ({
    lessonSlug: null,
    lessonReviewSections: [],
    sectionResults: {},
    lessonStarted: false,
    isLessonComplete: false,
    isReadOnly: false,
    isHydratingInitialProgress: false,
  });

/**
 * Checks whether every review section is currently complete.
 * @param lessonReviewSections Ordered list of review sections for this lesson.
 * @param sectionResults Current section results map.
 * @returns True when all configured review sections are complete.
 */
export const getIsLessonComplete = (
  lessonReviewSections: Readonly<LessonReviewSection[]>,
  sectionResults: LessonSectionResults,
) =>
  lessonReviewSections.every((section) => sectionResults[section]?.isComplete);

/**
 * Applies completion retention rules after section-result updates.
 * Video keeps completion once achieved; other sections are marked incomplete on update.
 * @param section Section being updated.
 * @param currentIsComplete Existing completion value for the section.
 * @returns Next completion value for the section.
 */
export const getIsCompleteAfterSectionResultUpdate = (
  section: LessonReviewSection,
  currentIsComplete?: boolean,
) => {
  if (section === "video") return currentIsComplete ?? false;
  return false;
};

/**
 * Derives top-level progress flags from the current section results.
 * @param lessonReviewSections Ordered list of review sections for this lesson.
 * @param sectionResults Current section results map.
 * @returns Derived lesson flags (`lessonStarted`, `isLessonComplete`).
 */
export const getLessonProgressFlags = (
  lessonReviewSections: Readonly<LessonReviewSection[]>,
  sectionResults: LessonSectionResults,
) => ({
  lessonStarted: Object.keys(sectionResults).length > 0,
  isLessonComplete: getIsLessonComplete(lessonReviewSections, sectionResults),
});

/**
 * Returns section results with a target section marked complete.
 * @param sectionResults Current section results map.
 * @param section Section to mark complete.
 * @returns Next section results map.
 */
export const createCompletedSectionResults = (
  sectionResults: LessonSectionResults,
  section: LessonReviewSection,
) => ({
  ...sectionResults,
  [section]: {
    ...sectionResults[section],
    isComplete: true,
  },
});

/**
 * Merges a section result payload while preserving section-specific completion rules.
 * @param sectionResults Current section results map.
 * @param section Section being updated.
 * @param result Partial result payload to merge.
 * @returns Next section results map.
 */
export const createUpdatedSectionResults = (
  sectionResults: LessonSectionResults,
  section: LessonReviewSection,
  result: QuizResult | VideoResult | IntroResult,
) => {
  const currentSectionResult = sectionResults[section];
  return {
    ...sectionResults,
    [section]: {
      ...currentSectionResult,
      ...result,
      isComplete: getIsCompleteAfterSectionResultUpdate(
        section,
        currentSectionResult?.isComplete,
      ),
    },
  };
};

/**
 * Applies lesson identity/settings and recomputes derived flags.
 * @param state Existing lesson progress state.
 * @param params Lesson identity, config, and section results.
 * @returns Next lesson progress state shape with derived flags recalculated.
 */
export const createInitialisedLessonState = (
  state: PupilLessonProgressDataState | PupilLessonProgressState,
  {
    lessonSlug,
    lessonReviewSections,
    sectionResults,
    isReadOnly,
    isHydratingInitialProgress,
  }: {
    lessonSlug: string;
    lessonReviewSections: Readonly<LessonReviewSection[]>;
    sectionResults: LessonSectionResults;
    isReadOnly: boolean;
    isHydratingInitialProgress: boolean;
  },
) => {
  const { lessonStarted, isLessonComplete } = getLessonProgressFlags(
    lessonReviewSections,
    sectionResults,
  );

  return {
    ...state,
    lessonSlug,
    lessonReviewSections,
    sectionResults,
    lessonStarted,
    isLessonComplete,
    isReadOnly,
    isHydratingInitialProgress,
  };
};
