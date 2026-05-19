import {
  createInitialQuizState,
  updateQuestionStateAtIndex,
} from "./pupilLessonQuizHelpers";
import {
  PupilLessonQuizInitArgs,
  PupilLessonQuizState,
} from "./pupilLessonQuizTypes";

import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

/**
 * Creates the default empty state for the page-based quiz store.
 *
 * @returns The empty quiz store state.
 */
export const getDefaultPupilLessonQuizState = () => ({
  lessonSlug: null,
  section: null,
  currentQuestionIndex: 0,
  questionState: [] as QuestionState[],
  numQuestions: 0,
  numInteractiveQuestions: 0,
  isHydratedComplete: false,
});

/**
 * Creates the state patch used to initialise a quiz run.
 *
 * @param _ - The current quiz state. This action does not use the existing state.
 * @param args - The quiz initialisation inputs.
 * @param args.lessonSlug - The lesson slug for the active lesson.
 * @param args.section - The current quiz section.
 * @param args.questionsArray - The questions in the quiz section.
 * @param args.initialQuestionResults - Previously saved question results, if available.
 * @returns The state patch required to initialise the quiz store.
 */
export const initialiseQuizAction = (
  _: PupilLessonQuizState,
  {
    lessonSlug,
    section,
    questionsArray,
    initialQuestionResults,
  }: PupilLessonQuizInitArgs,
) => ({
  lessonSlug,
  section,
  ...createInitialQuizState({
    questionsArray,
    initialQuestionResults,
  }),
});

/**
 * Creates the state patch for updating the active question.
 *
 * @param state - The current quiz store state.
 * @param result - The partial question state update to apply.
 * @returns The state patch containing the updated question state array.
 */
export const updateQuestionAtCurrentIndexAction = (
  state: PupilLessonQuizState,
  result: Partial<QuestionState>,
) => ({
  questionState: updateQuestionStateAtIndex({
    questionState: state.questionState,
    questionIndex: state.currentQuestionIndex,
    result,
  }),
});

/**
 * Creates the state patch for moving to the next question.
 *
 * @param state - The current quiz store state.
 * @returns The state patch with the next question index, capped at the quiz length.
 */
export const handleNextQuestionAction = (state: PupilLessonQuizState) => ({
  currentQuestionIndex: Math.min(
    state.currentQuestionIndex + 1,
    state.numQuestions,
  ),
});
