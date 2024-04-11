import React, {
  ReactNode,
  createContext,
  memo,
  useCallback,
  useContext,
  useState,
} from "react";

import { isOrderAnswer } from "../QuizUtils/answerTypeDiscriminators";
import { invariant } from "../pupilUtils/invariant";

import type { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import {
  isLessonReviewSection,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import { getInteractiveQuestions } from "@/components/PupilComponents/QuizUtils/questionUtils";

export type QuestionsArray = NonNullable<QuizQuestion[]>;

export type QuizEngineProps = {
  children: ReactNode;
  questionsArray: QuestionsArray;
};

export type QuestionFeedbackType = "correct" | "incorrect" | null;
export type QuestionModeType =
  | "init"
  | "incomplete"
  | "input"
  | "grading"
  | "feedback";

type QuestionState = {
  mode: QuestionModeType;
  grade: number;
  offerHint: boolean;
  feedback?: QuestionFeedbackType | QuestionFeedbackType[];
  isPartiallyCorrect?: boolean;
};

export type QuizEngineContextType = {
  currentQuestionData?: QuestionsArray[number];
  currentQuestionIndex: number;
  currentQuestionDisplayIndex: number; // this excludes explanatory-text questions
  questionState: QuestionState[];
  score: number;
  numQuestions: number;
  numInteractiveQuestions: number;
  updateQuestionMode: (mode: QuestionModeType) => void;
  handleSubmitMCAnswer: (pupilAnswer?: MCAnswer | MCAnswer[] | null) => void;
  handleSubmitShortAnswer: (pupilAnswer?: string) => void;
  handleSubmitOrderAnswer: (pupilAnswers: number[]) => void;
  handleSubmitMatchAnswer: (matches: string[], choices: string[]) => void;
  handleNextQuestion: () => void;
} | null;

// this is used by storybook to mock the QuizEngineContext
export const QuizEngineContext = createContext<QuizEngineContextType>(null);

export const useQuizEngineContext = () => {
  const context = useContext(QuizEngineContext);
  if (!context) {
    throw new Error("`QuizEngineProvider` is not available");
  }
  return context;
};

export const QuizEngineProvider = memo((props: QuizEngineProps) => {
  const { questionsArray } = props;
  const { updateSectionResult, completeSection, currentSection } =
    useLessonEngineContext();

  // consolidate all this state into a single stateful object . This will make side effects easier to manage
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestionData = questionsArray[currentQuestionIndex];
  const [questionState, setQuestionState] = useState<QuestionState[]>(
    questionsArray.map(() => ({
      mode: "init",
      offerHint: false,
      grade: 0,
      feedback: undefined,
    })),
  );

  const numQuestions = questionsArray.length;
  const numInteractiveQuestions =
    getInteractiveQuestions(questionsArray).length;
  const score = questionState.reduce((acc, curr) => acc + curr.grade, 0);

  const updateCurrentQuestion = useCallback(
    (incomingQuestionState: Partial<QuestionState>) => {
      setQuestionState((currentState) => {
        const newState = [...currentState];
        newState[currentQuestionIndex] = {
          offerHint: false,
          grade: 0,
          mode: "init",
          ...currentState[currentQuestionIndex],
          ...incomingQuestionState,
        };
        updateSectionResult({
          grade: newState.reduce((pv, v) => pv + v.grade, 0),
          numQuestions: numInteractiveQuestions,
        });
        return newState;
      });
    },
    [currentQuestionIndex, numInteractiveQuestions, updateSectionResult],
  );

  const updateQuestionMode = useCallback(
    (mode: QuestionModeType) => {
      updateCurrentQuestion({ mode });
    },
    [updateCurrentQuestion],
  );

  const handleSubmitMCAnswer = useCallback(
    (pupilAnswer?: MCAnswer | MCAnswer[] | null) => {
      const questionAnswers = currentQuestionData?.answers?.["multiple-choice"];
      const correctAnswers = questionAnswers?.filter(
        (answer) => answer?.answerIsCorrect,
      );

      const pupilAnswerArray = Array.isArray(pupilAnswer)
        ? pupilAnswer
        : [pupilAnswer];

      const feedback = questionAnswers?.map((answer) => {
        // every answer receives feedback whether the student has selected it or not
        // which are the correct choices are implied by the combination of whether it is selected and the feedback
        if (pupilAnswerArray.includes(answer)) {
          // Where pupils have selected an answer
          return correctAnswers?.includes(answer) ? "correct" : "incorrect";
        } else {
          // where pupils have not selected an answer
          return correctAnswers?.includes(answer) ? "incorrect" : "correct";
        }
      });

      const grade = !feedback?.includes("incorrect") ? 1 : 0;

      const isPartiallyCorrect =
        (grade === 0 &&
          currentQuestionData?.answers?.["multiple-choice"]?.some(
            (answer, index) => {
              return answer?.answerIsCorrect && feedback?.[index] === "correct";
            },
          )) ??
        false;

      updateCurrentQuestion({
        mode: "feedback",
        grade,
        feedback,
        isPartiallyCorrect,
      });
    },
    [currentQuestionData?.answers, updateCurrentQuestion],
  );

  const handleSubmitShortAnswer = useCallback(
    (pupilAnswer?: string) => {
      const questionAnswers = currentQuestionData?.answers?.["short-answer"];
      const correctAnswers = questionAnswers?.map(
        (answer) => answer?.answer?.[0]?.text,
      );
      const feedback: QuestionFeedbackType = correctAnswers?.includes(
        pupilAnswer,
      )
        ? "correct"
        : "incorrect";

      const grade = feedback === "correct" ? 1 : 0;

      updateCurrentQuestion({
        mode: "feedback",
        grade,
        feedback,
      });
    },
    [currentQuestionData?.answers, updateCurrentQuestion],
  );

  /**
   * Receives an array containing the order of the answers given
   * The order is 1-indexed like `correct_order` in the question data
   * for ease of comparison
   */
  const handleSubmitOrderAnswer = useCallback(
    (pupilAnswers: number[]) => {
      const answers = currentQuestionData?.answers;

      invariant(
        answers && isOrderAnswer(answers),
        "answers are not for an order question",
      );

      const correctAnswers = answers.order.map(
        (answer) => answer.correct_order,
      );
      const feedback: QuestionFeedbackType[] = pupilAnswers.map(
        (pupilAnswer, i) =>
          correctAnswers[i] === pupilAnswer ? "correct" : "incorrect",
      );
      const isCorrect = feedback.every((feedback) => feedback === "correct");
      const isPartiallyCorrect =
        !isCorrect && feedback.some((feedback) => feedback === "correct");

      updateCurrentQuestion({
        mode: "feedback",
        grade: isCorrect ? 1 : 0,
        feedback,
        isPartiallyCorrect,
      });
    },
    [currentQuestionData?.answers, updateCurrentQuestion],
  );

  /**
   * Receives two arrays one contains the id of the match and the other the id of the choice made by the pupil
   *
   * the indexes for the two arrays correspond to each other.
   *
   * E.g. if the first item in the `matches` array is "1" and the first item in the `choices` array is "1" then the choice was correct
   */
  const handleSubmitMatchAnswer = useCallback(
    (matches: string[], choices: string[]) => {
      const feedback: QuestionFeedbackType[] = matches.map((matchId, i) =>
        choices[i] === matchId ? "correct" : "incorrect",
      );
      const isCorrect = feedback.every((feedback) => feedback === "correct");
      const isPartiallyCorrect =
        !isCorrect && feedback.some((feedback) => feedback === "correct");

      updateCurrentQuestion({
        mode: "feedback",
        grade: isCorrect ? 1 : 0,
        feedback,
        isPartiallyCorrect,
      });
    },
    [updateCurrentQuestion],
  );

  const handleNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => {
      const _currentQuestionIndex = Math.min(prev + 1, numQuestions);
      if (
        _currentQuestionIndex === numQuestions &&
        isLessonReviewSection(currentSection)
      ) {
        completeSection(currentSection);
      }
      return _currentQuestionIndex;
    });
  }, [numQuestions, setCurrentQuestionIndex, completeSection, currentSection]);

  const currentQuestionDisplayIndex =
    currentQuestionIndex - (numQuestions - numInteractiveQuestions);

  return (
    <QuizEngineContext.Provider
      value={{
        currentQuestionData,
        currentQuestionIndex,
        currentQuestionDisplayIndex,
        questionState,
        score,
        numQuestions,
        numInteractiveQuestions,
        updateQuestionMode,
        handleSubmitMCAnswer,
        handleSubmitShortAnswer,
        handleSubmitOrderAnswer,
        handleSubmitMatchAnswer,
        handleNextQuestion,
      }}
    >
      {props.children}
    </QuizEngineContext.Provider>
  );
});
