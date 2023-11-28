import React, { ReactNode, useEffect, useState, createContext } from "react";

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

type QuizEngineContext = {
  currentQuestionData: QuestionsArray[number] | undefined;
  currentQuestionIndex: number;
  questionState: QuestionState;
  handleSubmitMCAnswer: (answer: MCAnswer | null | undefined) => void;
  handleNextQuestion: () => void;
};

export const quizEngineContext = createContext<QuizEngineContext>({
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

export const QuizEngineProvider = (props: QuizEngineProps) => {
  const { questionsArray } = props;
  const multipleChoiceQuestionsArray = questionsArray.filter(
    (question) =>
      question.questionType === "multiple-choice" && question.answers,
  );
  const numberOfQuestions = multipleChoiceQuestionsArray.length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionData, setQuestionData] = useState(
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
    setQuestionData(multipleChoiceQuestionsArray[currentQuestionIndex]);
  }, [currentQuestionIndex, multipleChoiceQuestionsArray]);

  const handleSubmitMCAnswer = (answer: MCAnswer | null | undefined) => {
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
  };

  const handleNextQuestion = () => {
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
  };

  return (
    <quizEngineContext.Provider
      value={{
        currentQuestionData,
        currentQuestionIndex,
        questionState,
        handleSubmitMCAnswer,
        handleNextQuestion,
      }}
    >
      {props.children}
    </quizEngineContext.Provider>
  );
};
