import React, {
  ReactNode,
  createContext,
  memo,
  useCallback,
  useContext,
  useState,
} from "react";

import { usePupilAnalytics } from "../PupilAnalyticsProvider/usePupilAnalytics";

import type { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import {
  isLessonReviewSection,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import { getInteractiveQuestions } from "@/components/PupilComponents/QuizUtils/questionUtils";
import type {
  QuestionFeedbackType,
  QuestionModeType,
  QuestionState,
} from "@/components/PupilComponents/QuizUtils/questionTypes";
import {
  isImage,
  isText,
} from "@/components/PupilComponents/QuizUtils/stemUtils";
import { invariant } from "@/utils/invariant";
import {
  isMatchAnswer,
  isOrderAnswer,
} from "@/components/PupilComponents/QuizUtils/answerTypeDiscriminators";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export type QuestionsArray = NonNullable<QuizQuestion[]>;

export type QuizEngineProps = {
  children: ReactNode;
  questionsArray: QuestionsArray;
};

export type QuizEngineContextType = {
  currentQuestionData?: QuestionsArray[number];
  currentQuestionIndex: number;
  currentQuestionDisplayIndex: number; // this excludes explanatory-text questions
  currentQuestionState?: QuestionState;
  questionState: QuestionState[];
  score: number;
  numQuestions: number;
  numInteractiveQuestions: number;
  updateQuestionMode: (mode: QuestionModeType) => void;
  updateHintOffered: (offerHint: boolean) => void;
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
  const { updateSectionResult, completeActivity, currentSection } =
    useLessonEngineContext();
  const { track } = usePupilAnalytics();

  // consolidate all this state into a single stateful object . This will make side effects easier to manage
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestionData = questionsArray[currentQuestionIndex];

  const [questionState, setQuestionState] = useState<QuestionState[]>(
    questionsArray.map(() => ({
      mode: "init",
      offerHint: false,
      grade: 0,
    })),
  );

  const numQuestions = questionsArray.length;
  const numInteractiveQuestions =
    getInteractiveQuestions(questionsArray).length;
  const score = questionState.reduce((acc, curr) => acc + curr.grade, 0);

  const updateCurrentQuestion = useCallback(
    (incomingQuestionState: Partial<QuestionState>) => {
      if (
        (currentSection === "starter-quiz" || currentSection === "exit-quiz") &&
        incomingQuestionState.mode === "feedback"
      ) {
        track.questionAttemptSubmitted({
          pupilExperienceLessonActivity: currentSection,
          questionType: currentQuestionData?.questionType
            ? currentQuestionData.questionType
            : "",
          questionResult:
            incomingQuestionState.grade === 1 ? "correct" : "incorrect",
          activityTimeSpent: 0,
          hintOffered: currentQuestionData?.hint ? true : false,
          hintAccessed: questionState[currentQuestionIndex]?.offerHint
            ? true
            : false,
          questionNumber: currentQuestionIndex + 1,
        });
      }
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
          questionResults: newState,
        });
        return newState;
      });
    },
    [
      currentQuestionIndex,
      numInteractiveQuestions,
      updateSectionResult,
      currentQuestionData,
      currentSection,
      questionState,
      track,
    ],
  );

  const updateQuestionMode = useCallback(
    (mode: QuestionModeType) => {
      updateCurrentQuestion({ mode });
    },
    [updateCurrentQuestion],
  );

  const updateHintOffered = useCallback(
    (offerHint: boolean) => {
      updateCurrentQuestion({ offerHint });
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

      const pupilAnswerIndexes = pupilAnswerArray.map((answer) => {
        return questionAnswers?.findIndex(
          (questionAnswer) => questionAnswer === answer,
        );
      });

      const feedback = questionAnswers?.map((answer) => {
        // every answer receives feedback whether the student has selected it or not
        // which are the correct choices are implied by the combination of whether it is selected and the feedback
        console.log("diego array", pupilAnswerArray[0]);
        console.log("diego answer", answer);
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

      const correctAnswerTextOrImageObject = correctAnswers
        ?.map((answer) => {
          const testAnswer = answer.answer?.find(isText)?.text;
          const imageAnswer = answer.answer?.find(isImage);
          return testAnswer ?? imageAnswer;
        })
        .filter((answer) => answer !== undefined);

      updateCurrentQuestion({
        mode: "feedback",
        grade,
        feedback,
        isPartiallyCorrect,
        pupilAnswer: pupilAnswerIndexes,
        correctAnswer: correctAnswerTextOrImageObject,
      });
    },
    [currentQuestionData?.answers, updateCurrentQuestion],
  );

  const handleSubmitShortAnswer = useCallback(
    (pupilAnswer?: string) => {
      const questionAnswers = currentQuestionData?.answers?.["short-answer"];

      const trimmedAnswer = pupilAnswer?.trim().toLowerCase() ?? "";

      const correctAnswers = questionAnswers
        ?.map((answer) =>
          answer?.answer?.[0]?.type === "text"
            ? answer?.answer?.[0].text
            : null,
        )
        .filter((answer) => answer !== null);

      const trimmedAnswers = correctAnswers?.map((answer) =>
        answer.trim().toLowerCase(),
      );

      const feedback: QuestionFeedbackType = trimmedAnswers?.includes(
        trimmedAnswer,
      )
        ? "correct"
        : "incorrect";

      const grade = feedback === "correct" ? 1 : 0;

      updateCurrentQuestion({
        mode: "feedback",
        grade,
        feedback,
        pupilAnswer,
        correctAnswer: correctAnswers,
      });
    },
    [currentQuestionData?.answers, updateCurrentQuestion],
  );

  /**
   * Receives an array containing the order of the answers given
   * The order is 1-indexed like `correctOrder` in the question data
   * for ease of comparison
   */
  const handleSubmitOrderAnswer = useCallback(
    (pupilAnswers: number[]) => {
      const answers = currentQuestionData?.answers;

      invariant(
        answers && isOrderAnswer(answers),
        "answers are not for an order question",
      );

      const sortedAnswers = [...answers.order]
        .sort((a, b) => (a.correctOrder ?? 0) - (b.correctOrder ?? 0))
        .map((answer) => answer.answer?.[0]?.text)
        .filter((answer) => answer !== undefined);

      // NB. feedback is in the order that the pupil arranged the answers not for the correct ordering
      const feedback: QuestionFeedbackType[] = pupilAnswers.map(
        (pupilAnswer, i) => (pupilAnswer === i + 1 ? "correct" : "incorrect"),
      );
      const isCorrect = feedback.every((feedback) => feedback === "correct");
      const isPartiallyCorrect =
        !isCorrect && feedback.some((feedback) => feedback === "correct");

      updateCurrentQuestion({
        mode: "feedback",
        grade: isCorrect ? 1 : 0,
        feedback,
        isPartiallyCorrect,
        pupilAnswer: pupilAnswers,
        correctAnswer: sortedAnswers,
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

      const answers = currentQuestionData?.answers;

      invariant(
        answers && isMatchAnswer(answers),
        "answers are not for a match question",
      );

      const correctAnswers = matches
        .map((m) => answers["match"][Number(m)]?.correctChoice)
        .map((answer) => answer?.find(isText)?.text ?? "");

      updateCurrentQuestion({
        mode: "feedback",
        grade: isCorrect ? 1 : 0,
        feedback,
        isPartiallyCorrect,
        pupilAnswer: choices,
        correctAnswer: correctAnswers,
      });
    },
    [currentQuestionData?.answers, updateCurrentQuestion],
  );

  const handleNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => {
      const _currentQuestionIndex = Math.min(prev + 1, numQuestions);
      if (
        _currentQuestionIndex === numQuestions &&
        isLessonReviewSection(currentSection)
      ) {
        // NB. in strict mode this will be called twice resulting in double logging
        completeActivity(currentSection);
      }
      return _currentQuestionIndex;
    });
  }, [numQuestions, setCurrentQuestionIndex, completeActivity, currentSection]);

  const currentQuestionDisplayIndex =
    currentQuestionIndex - (numQuestions - numInteractiveQuestions);

  return (
    <QuizEngineContext.Provider
      value={{
        currentQuestionData,
        currentQuestionIndex,
        currentQuestionDisplayIndex,
        currentQuestionState: questionState[currentQuestionIndex],
        questionState,
        score,
        numQuestions,
        numInteractiveQuestions,
        updateQuestionMode,
        updateHintOffered,
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
