import React, {
  ReactNode,
  createContext,
  useMemo,
  memo,
  useCallback,
  useContext,
} from "react";

import {
  LessonOverviewQuizData,
  MCAnswer,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { useStateCallback } from "@/hooks/useStateCallback";

export type QuestionsArray = NonNullable<LessonOverviewQuizData>;

export type QuizEngineProps = {
  children: ReactNode;
  questionsArray: QuestionsArray;
};

export type QuestionFeedbackType = "correct" | "incorrect" | null;
export type QuestionModeType = "init" | "input" | "grading" | "feedback";

type QuestionState = {
  mode: QuestionModeType;
  grade: number;
  offerHint: boolean;
  feedback?: QuestionFeedbackType | QuestionFeedbackType[];
};

export type QuizEngineContextType = {
  currentQuestionData?: QuestionsArray[number];
  currentQuestionIndex: number;
  questionState: QuestionState[];
  score: number;
  maxScore: number;
  updateQuestionMode: (mode: QuestionModeType) => void;
  handleSubmitMCAnswer: (pupilAnswer?: MCAnswer | MCAnswer[] | null) => void;
  handleSubmitShortAnswer: (pupilAnswer?: string) => void;
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
  const { updateQuizResult, completeSection, currentSection } =
    useLessonEngineContext();

  const filteredQuestions = useMemo(
    () =>
      questionsArray.filter(
        (question) =>
          question.questionType === "multiple-choice" ||
          question.questionType === "short-answer",
      ),
    [questionsArray],
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useStateCallback(0);
  const currentQuestionData = filteredQuestions[currentQuestionIndex];
  const [questionState, setQuestionState] = useStateCallback<QuestionState[]>(
    filteredQuestions.map(() => ({
      mode: "init",
      offerHint: false,
      grade: 0,
      feedback: undefined,
    })),
  );

  const maxScore = filteredQuestions.length;

  const score = questionState.reduce((acc, curr) => acc + curr.grade, 0);

  const handleScoreUpdate = useCallback(
    (_questionState: QuestionState[]) => {
      updateQuizResult({
        grade: _questionState.reduce((pv, v) => pv + v.grade, 0),
        maxScore,
      });
    },
    [maxScore, updateQuizResult],
  );

  const updateQuestionMode = useCallback(
    (mode: QuestionModeType) => {
      setQuestionState((prev) => {
        const newState = [...prev];

        newState[currentQuestionIndex] = {
          mode,
          offerHint: prev[currentQuestionIndex]?.offerHint ?? false,
          grade: prev[currentQuestionIndex]?.grade ?? 0,
          feedback: prev[currentQuestionIndex]?.feedback,
        };

        return newState;
      });
    },
    [currentQuestionIndex, setQuestionState],
  );

  const handleSubmitMCAnswer = useCallback(
    (pupilAnswer?: MCAnswer | MCAnswer[] | null) => {
      const questionAnswers = currentQuestionData?.answers?.["multiple-choice"];
      const correctAnswers = questionAnswers?.filter(
        (answer) => answer.answer_is_correct,
      );

      const pupilAnswerArray = Array.isArray(pupilAnswer)
        ? pupilAnswer
        : [pupilAnswer];

      const matchingAnswers = pupilAnswerArray?.filter(
        (answer) => answer && correctAnswers?.includes(answer),
      );

      const grade = matchingAnswers.length === correctAnswers?.length ? 1 : 0;

      setQuestionState((prev) => {
        const newState = [...prev];
        newState[currentQuestionIndex] = {
          mode: "feedback",
          grade,
          feedback: questionAnswers?.map((answer) => {
            // every answer receives feedback whether the student has selected it or not
            // which are the correct choices are implied by the combination of whether it is selected and the feedback
            if (pupilAnswerArray.includes(answer)) {
              // Where pupils have selected an answer
              return correctAnswers?.includes(answer) ? "correct" : "incorrect";
            } else {
              // where pupils have not selected an answer
              return correctAnswers?.includes(answer) ? "incorrect" : "correct";
            }
          }),
          offerHint: prev[currentQuestionIndex]?.offerHint ?? false,
        };
        return newState;
      }, handleScoreUpdate);
    },
    [
      currentQuestionData,
      currentQuestionIndex,
      setQuestionState,
      handleScoreUpdate,
    ],
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

      setQuestionState((prev) => {
        const newState = [...prev];
        newState[currentQuestionIndex] = {
          mode: "feedback",
          grade,
          feedback,
          offerHint: prev[currentQuestionIndex]?.offerHint ?? false,
        };
        return newState;
      }, handleScoreUpdate);
    },
    [
      currentQuestionData,
      currentQuestionIndex,
      setQuestionState,
      handleScoreUpdate,
    ],
  );

  const handleNextQuestion = useCallback(() => {
    setCurrentQuestionIndex(
      (prev) => Math.min(prev + 1, maxScore),
      (index) => {
        if (index === maxScore) {
          completeSection(currentSection);
        }
      },
    );
  }, [maxScore, setCurrentQuestionIndex, completeSection, currentSection]);

  return (
    <QuizEngineContext.Provider
      value={{
        currentQuestionData,
        currentQuestionIndex,
        questionState,
        score,
        maxScore,
        updateQuestionMode,
        handleSubmitMCAnswer,
        handleSubmitShortAnswer,
        handleNextQuestion,
      }}
    >
      {props.children}
    </QuizEngineContext.Provider>
  );
});
