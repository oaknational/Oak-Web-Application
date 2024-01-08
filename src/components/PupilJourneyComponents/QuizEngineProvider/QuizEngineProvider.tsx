import React, {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useMemo,
  memo,
  useCallback,
} from "react";

import {
  LessonOverviewQuizData,
  MCAnswer,
} from "@/node-lib/curriculum-api-2023/shared.schema";

type QuestionsArray = NonNullable<LessonOverviewQuizData>;

export type QuizEngineProps = {
  children: ReactNode;
  questionsArray: QuestionsArray;
};

type QuestionFeedbackType = "correct" | "incorrect" | null;
type QuestionModeType = "init" | "input" | "grading" | "feedback";

type QuestionState = {
  mode: QuestionModeType;
  grade: number;
  offerHint: boolean;
  feedback?: QuestionFeedbackType[];
};

export type QuizEngineContextType = {
  currentQuestionData?: QuestionsArray[number];
  currentQuestionIndex: number;
  questionState: QuestionState[];
  score: number;
  maxScore: number;
  isComplete: boolean;
  updateQuestionMode: (mode: QuestionModeType) => void;
  handleSubmitMCAnswer: (pupilAnswer?: MCAnswer | MCAnswer[] | null) => void;
  handleNextQuestion: () => void;
} | null;

export const QuizEngineContext = createContext<QuizEngineContextType>(null);

export const QuizEngineProvider = memo((props: QuizEngineProps) => {
  const { questionsArray } = props;

  const filteredQuestions = useMemo(
    () =>
      questionsArray.filter(
        (question) =>
          question.questionType === "multiple-choice" && question.answers,
      ),
    [questionsArray],
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionData, setCurrentQuestionData] = useState(
    filteredQuestions[currentQuestionIndex],
  );
  const [questionState, setQuestionState] = useState<QuestionState[]>(
    filteredQuestions.map(() => ({
      mode: "init",
      offerHint: false,
      grade: 0,
      feedback: undefined,
    })),
  );
  const [score, setScore] = useState(0);
  const maxScore = filteredQuestions.length;
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setCurrentQuestionData(filteredQuestions[currentQuestionIndex]);
  }, [currentQuestionIndex, filteredQuestions]);

  const score = questionState.reduce((acc, curr) => acc + curr.grade, 0);

  useEffect(() => {
    setIsComplete(currentQuestionIndex >= maxScore);
  }, [currentQuestionIndex, maxScore]);

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
    [currentQuestionIndex],
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
      });
    },
    [currentQuestionData, currentQuestionIndex],
  );

  const handleNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, maxScore));
  }, [maxScore]);

  return (
    <QuizEngineContext.Provider
      value={{
        currentQuestionData: useMemo(
          () => currentQuestionData,
          [currentQuestionData],
        ),
        currentQuestionIndex: useMemo(
          () => currentQuestionIndex,
          [currentQuestionIndex],
        ),
        questionState: useMemo(() => questionState, [questionState]),
        score: useMemo(() => score, [score]),
        maxScore,
        isComplete: useMemo(() => isComplete, [isComplete]),
        updateQuestionMode,
        handleSubmitMCAnswer,
        handleNextQuestion,
      }}
    >
      {props.children}
    </QuizEngineContext.Provider>
  );
});
