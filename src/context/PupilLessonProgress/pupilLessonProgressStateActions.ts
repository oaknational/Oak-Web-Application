import {
  createCompletedSectionResults,
  createInitialisedLessonState,
  createUpdatedSectionResults,
  getDefaultLessonProgressState,
  getLessonProgressFlags,
} from "./pupilLessonProgressHelpers";
import {
  IntroResult,
  LessonProgressInitArgs,
  LessonReviewSection,
  PupilLessonProgressState,
  QuizResult,
  VideoResult,
} from "./pupilLessonProgressTypes";

/**
 * Creates the state patch for lesson initialisation.
 * For new lessons, this returns a reset baseline seeded with incoming lesson data.
 * For the same lesson, this preserves existing progress and reapplies config flags.
 * @param state Current lesson progress state.
 * @param args Initialisation input payload.
 * @returns State patch for `set(...)`.
 */
export const lessonInitialiseAction = (
  state: PupilLessonProgressState,
  {
    lessonSlug,
    lessonReviewSections,
    initialSectionResults,
    isReadOnly = false,
    isHydratingInitialProgress = false,
  }: LessonProgressInitArgs,
) => {
  const isNewLesson = state.lessonSlug !== lessonSlug;

  if (isNewLesson) {
    return createInitialisedLessonState(getDefaultLessonProgressState(), {
      lessonSlug,
      lessonReviewSections,
      sectionResults: initialSectionResults ?? {},
      isReadOnly,
      isHydratingInitialProgress,
    });
  }

  return createInitialisedLessonState(state, {
    lessonSlug,
    lessonReviewSections,
    sectionResults: state.sectionResults,
    isReadOnly,
    isHydratingInitialProgress,
  });
};

/**
 * Creates the state patch that marks a section complete.
 * @param state Current lesson progress state.
 * @param section Section to mark complete.
 * @returns State patch for `set(...)`.
 */
export const completeSectionAction = (
  state: PupilLessonProgressState,
  section: LessonReviewSection,
) => {
  const nextSectionResults = createCompletedSectionResults(
    state.sectionResults,
    section,
  );

  return {
    lessonStarted: true,
    sectionResults: nextSectionResults,
    isLessonComplete: getLessonProgressFlags(
      state.lessonReviewSections,
      nextSectionResults,
    ).isLessonComplete,
  };
};

/**
 * Creates the state patch for in-progress section result updates.
 * @param state Current lesson progress state.
 * @param section Section to update.
 * @param result Partial in-progress result payload.
 * @returns State patch for `set(...)`.
 */
export const updateSectionInProgressResultAction = (
  state: PupilLessonProgressState,
  section: LessonReviewSection,
  result: QuizResult | VideoResult | IntroResult,
) => {
  const nextSectionResults = createUpdatedSectionResults(
    state.sectionResults,
    section,
    result,
  );

  return {
    lessonStarted: true,
    sectionResults: nextSectionResults,
    isLessonComplete: getLessonProgressFlags(
      state.lessonReviewSections,
      nextSectionResults,
    ).isLessonComplete,
  };
};
