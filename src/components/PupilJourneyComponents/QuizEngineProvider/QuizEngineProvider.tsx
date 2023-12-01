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

type QuestionState = {
  mode: "input" | "feedback" | "end";
  answer: undefined | "correct" | "incorrect";
  offerHint: boolean;
  score: number;
  maximumScore: number;
};

export type QuizEngineContextType = {
  currentQuestionData: QuestionsArray[number] | undefined;
  currentQuestionIndex: number;
  questionState: QuestionState;
  handleSubmitMCAnswer: (answer: MCAnswer | null | undefined) => void;
  handleNextQuestion: () => void;
};

export const QuizEngineContext = createContext<QuizEngineContextType>({
  currentQuestionData: undefined,
  currentQuestionIndex: 0,
  questionState: {
    mode: "input",
    answer: undefined,
    offerHint: false,
    score: 0,
    maximumScore: 0,
  },
  handleSubmitMCAnswer: () => {},
  handleNextQuestion: () => {},
});

export const QuizEngineProvider = memo((props: QuizEngineProps) => {
  const { questionsArray } = props;

  const multipleChoiceQuestionsArray = useMemo(
    () =>
      questionsArray.filter(
        (question) =>
          question.questionType === "multiple-choice" && question.answers,
      ),
    [questionsArray],
  );

  const numberOfQuestions = useMemo(
    () => multipleChoiceQuestionsArray.length,
    [multipleChoiceQuestionsArray],
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionData, setCurrentQuestionData] = useState(
    multipleChoiceQuestionsArray[currentQuestionIndex],
  );
  const [questionState, setQuestionState] = useState<QuestionState>({
    mode: "input",
    answer: undefined,
    offerHint: false,
    score: 0,
    maximumScore: numberOfQuestions,
  });

  useEffect(() => {
    console.log(
      "rendering QuizEngineProvider",
      currentQuestionIndex,
      questionState,
    );
  }, [currentQuestionIndex, currentQuestionData, questionState]);

  useEffect(() => {
    const desiredQuestionData =
      multipleChoiceQuestionsArray[currentQuestionIndex];
    setCurrentQuestionData(desiredQuestionData);
  }, [currentQuestionIndex, multipleChoiceQuestionsArray]);

  const handleSubmitMCAnswer = useCallback(
    (answer: MCAnswer | null | undefined) => {
      const questionAnswers = currentQuestionData?.answers;
      const correctAnswerArray = questionAnswers?.["multiple-choice"]?.filter(
        (answer) => answer.answer_is_correct,
      );
      const isCorrect = answer && correctAnswerArray?.includes(answer);

      if (isCorrect) {
        setQuestionState((preState) => ({
          ...preState,
          score: preState.score + 1,
          mode: "feedback",
          answer: "correct",
        }));
      } else {
        setQuestionState({
          ...questionState,
          mode: "feedback",
          answer: "incorrect",
        });
      }
    },
    [currentQuestionData, questionState],
  );

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex === numberOfQuestions - 1) {
      setQuestionState({
        ...questionState,
        mode: "end",
      });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionState({
        ...questionState,
        mode: "input",
        answer: undefined,
      });
    }
  }, [currentQuestionIndex, numberOfQuestions, questionState]);

  const value = useMemo(() => {
    return {
      currentQuestionData,
      currentQuestionIndex,
      questionState,
      handleSubmitMCAnswer,
      handleNextQuestion,
    };
  }, [
    currentQuestionData,
    currentQuestionIndex,
    questionState,
    handleSubmitMCAnswer,
    handleNextQuestion,
  ]);

  return (
    <QuizEngineContext.Provider value={value}>
      {props.children}
    </QuizEngineContext.Provider>
  );
});
