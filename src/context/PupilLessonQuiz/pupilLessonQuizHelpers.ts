import { QuestionsArray } from "./pupilLessonQuizTypes";

import { getInteractiveQuestions } from "@/components/PupilComponents/Views/ViewHelpers/Quiz/getInteractiveQuestions";
import {
  QuestionModeType,
  QuestionState,
} from "@/components/PupilComponents/QuizUtils/questionTypes";
import { QuizResult } from "@/context/PupilLessonProgress";

/**
 * Creates the default state for a quiz question before the pupil interacts with it.
 *
 * @returns The initial question state.
 */
export const getDefaultQuestionState = (): QuestionState => ({
  mode: "init",
  offerHint: false,
  grade: 0,
});

/**
 * Builds the initial per-question state array for a quiz.
 *
 * @param params - The question list and any previously saved question results.
 * @param params.questionsArray - The questions in the quiz section.
 * @param params.initialQuestionResults - Previously saved question results, if available.
 * @returns The initial state for each question.
 */
export const getInitialQuestionState = ({
  questionsArray,
  initialQuestionResults,
}: {
  questionsArray: QuestionsArray;
  initialQuestionResults?: QuestionState[];
}) =>
  questionsArray.map(
    (_, index) => initialQuestionResults?.[index] ?? getDefaultQuestionState(),
  );

/**
 * Finds the first question that should be shown when hydrating saved results.
 *
 * @param initialQuestionResults - Previously saved question results, if available.
 * @param questionsArray - The questions in the quiz section.
 * @returns The initial question index for the hydrated quiz state.
 */
export const getInitialQuestionIndex = (
  initialQuestionResults: QuestionState[] | undefined,
  questionsArray: QuestionsArray,
) => {
  const nextQuestionIndex =
    initialQuestionResults?.findIndex((item) => item.mode !== "feedback") ?? 0;

  if (nextQuestionIndex === -1 && Boolean(initialQuestionResults?.length)) {
    return questionsArray.length;
  }

  return Math.max(nextQuestionIndex, 0);
};

/**
 * Determines whether the hydrated question results represent a completed quiz.
 *
 * @param initialQuestionResults - Previously saved question results, if available.
 * @returns `true` when every saved question is already in feedback mode.
 */
export const getIsHydratedComplete = (
  initialQuestionResults: QuestionState[] | undefined,
) => {
  if (!initialQuestionResults?.length) return false;
  return initialQuestionResults.every((item) => item.mode === "feedback");
};

/**
 * Converts a raw question index into the displayed interactive-question number.
 *
 * @param params - The values required to calculate the displayed question number.
 * @param params.currentQuestionIndex - The zero-based index in the full question array.
 * @param params.numQuestions - The total number of entries in the section.
 * @param params.numInteractiveQuestions - The number of interactive questions in the section.
 * @returns The displayed question number adjusted for non-interactive entries.
 */
export const getCurrentQuestionDisplayIndex = ({
  currentQuestionIndex,
  numQuestions,
  numInteractiveQuestions,
}: {
  currentQuestionIndex: number;
  numQuestions: number;
  numInteractiveQuestions: number;
}) => currentQuestionIndex - (numQuestions - numInteractiveQuestions);

/**
 * Merges a partial question result into the current question state.
 *
 * @param params - The current question state and partial update.
 * @param params.currentQuestionState - The existing state for the question, if present.
 * @param params.result - The partial state update to apply.
 * @returns The merged question state with default fields preserved.
 */
export const createUpdatedQuestionState = ({
  currentQuestionState,
  result,
}: {
  currentQuestionState?: QuestionState;
  result: Partial<QuestionState>;
}): QuestionState => ({
  ...getDefaultQuestionState(),
  ...currentQuestionState,
  ...result,
});

/**
 * Replaces one entry in the question state array with an updated value.
 *
 * @param params - The current question state array and update details.
 * @param params.questionState - The existing state for all questions.
 * @param params.questionIndex - The index of the question to update.
 * @param params.result - The partial state update to apply.
 * @returns A new question state array with the requested question updated.
 */
export const updateQuestionStateAtIndex = ({
  questionState,
  questionIndex,
  result,
}: {
  questionState: QuestionState[];
  questionIndex: number;
  result: Partial<QuestionState>;
}) => {
  const nextQuestionState = [...questionState];
  nextQuestionState[questionIndex] = createUpdatedQuestionState({
    currentQuestionState: questionState[questionIndex],
    result,
  });

  return nextQuestionState;
};

/**
 * Converts in-memory quiz state into the persisted lesson progress result.
 *
 * @param params - The quiz state required to build the persisted result.
 * @param params.questionState - The current state for each quiz question.
 * @param params.numInteractiveQuestions - The number of interactive questions in the section.
 * @returns The persisted quiz result shape used by lesson progress.
 */
export const buildPersistedQuizResult = ({
  questionState,
  numInteractiveQuestions,
}: {
  questionState: QuestionState[];
  numInteractiveQuestions: number;
}): QuizResult => ({
  grade: questionState.reduce((acc, curr) => acc + curr.grade, 0),
  numQuestions: numInteractiveQuestions,
  questionResults: questionState,
});

/**
 * Builds the initial state payload for the page-based quiz store.
 *
 * @param params - The values required to initialise quiz state.
 * @param params.questionsArray - The questions in the quiz section.
 * @param params.initialQuestionResults - Previously saved question results, if available.
 * @returns The initial quiz store state derived from the provided inputs.
 */
export const createInitialQuizState = ({
  questionsArray,
  initialQuestionResults,
}: {
  questionsArray: QuestionsArray;
  initialQuestionResults?: QuestionState[];
}) => ({
  questionState: getInitialQuestionState({
    questionsArray,
    initialQuestionResults,
  }),
  currentQuestionIndex: getInitialQuestionIndex(
    initialQuestionResults,
    questionsArray,
  ),
  numQuestions: questionsArray.length,
  numInteractiveQuestions: getInteractiveQuestions(questionsArray).length,
  isHydratedComplete: getIsHydratedComplete(initialQuestionResults),
});

/**
 * Creates a partial question state update for a mode change.
 *
 * @param mode - The next question mode.
 * @returns A partial question state containing only the new mode.
 */
export const getNextQuestionModeResult = (
  mode: QuestionModeType,
): Partial<QuestionState> => ({ mode });
