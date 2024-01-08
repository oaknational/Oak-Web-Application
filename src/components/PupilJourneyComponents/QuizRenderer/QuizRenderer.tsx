import { createRef, useEffect, useRef } from "react";
import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakSpan,
} from "@oak-academy/oak-components";

import { useQuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { QuizQuestionStem } from "@/components/PupilJourneyComponents/QuizQuestionStem";
import { QuizMCQSingleAnswer } from "@/components/PupilJourneyComponents/QuizMCQSingleAnswer/QuizMCQSingleAnswer";
import { QuizMCQMultiAnswer } from "@/components/PupilJourneyComponents/QuizMCQMultiAnswer/QuizMCQMultiAnswer";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizRenderer = () => {
  const quizEngineContext = useQuizEngineContext();
  const mcAnswerRefs = useRef<React.RefObject<HTMLInputElement>[]>([]);

  const {
    currentQuestionData,
    currentQuestionIndex,
    questionState,
    isComplete,
    score,
    maxScore,
    handleNextQuestion,
    updateQuestionMode,
  } = quizEngineContext;

  let innerRender = null;

  let questionFeedback = null;

  // on question change, reset the refs
  useEffect(() => {
    if (currentQuestionData?.questionType === "multiple-choice") {
      const answers = currentQuestionData?.answers?.["multiple-choice"];
      mcAnswerRefs.current = answers?.map(() => createRef()) ?? [];
    }
  }, [currentQuestionData, currentQuestionIndex]);

  if (isComplete) {
    innerRender = (
      <OakFlex>
        <OakSpan>
          End of quiz, score: {score}/{maxScore}
        </OakSpan>
      </OakFlex>
    );
  } else if (currentQuestionData) {
    const { questionStem, answers } = currentQuestionData;

    const MCAnswers = answers?.["multiple-choice"];
    const isFeedbackMode =
      questionState[currentQuestionIndex]?.mode === "feedback";

    let answerRender = null;

    const handleInitialChange = () => {
      console.log("handleInitialChange");
      if (questionState[currentQuestionIndex]?.mode === "init") {
        updateQuestionMode("input");
      }
    };

    if (MCAnswers) {
      if (MCAnswers.filter((a) => a.answer_is_correct).length > 1) {
        answerRender = (
          <QuizMCQMultiAnswer
            answerRefs={mcAnswerRefs.current}
            onInitialChange={handleInitialChange}
          />
        );
      } else {
        answerRender = (
          <QuizMCQSingleAnswer
            answerRefs={mcAnswerRefs.current}
            onInitialChange={handleInitialChange}
          />
        );
      }
    }

    const handleSubmit = () => {
      updateQuestionMode("grading");

      switch (currentQuestionData.questionType) {
        case "multiple-choice": {
          const answers = currentQuestionData?.answers?.["multiple-choice"];
          const selectedAnswers: MCAnswer[] = mcAnswerRefs.current
            .map((ref, index) => {
              return ref.current?.checked && answers ? answers[index] : null;
            })
            .filter((answer): answer is MCAnswer => !!answer); // remove nulls
          quizEngineContext?.handleSubmitMCAnswer(selectedAnswers);
          break;
        }
        case "short-answer":
        case "order":
        case "match":
        default:
          break;
      }
    };

    innerRender = (
      <OakFlex $flexDirection={"column"} $gap={"all-spacing-5"}>
        <QuizQuestionStem
          questionStem={questionStem}
          index={currentQuestionIndex}
          showIndex={true}
        />
        {answerRender}
        {!isFeedbackMode && (
          <OakFlex $pt="inner-padding-l">
            <OakPrimaryButton
              disabled={questionState[currentQuestionIndex]?.mode === "init"}
              onClick={handleSubmit}
            >
              Submit
            </OakPrimaryButton>
          </OakFlex>
        )}
        {isFeedbackMode && (
          <OakFlex $pt="inner-padding-l">
            <OakPrimaryButton onClick={handleNextQuestion}>
              Next Question
            </OakPrimaryButton>
          </OakFlex>
        )}
      </OakFlex>
    );

    questionFeedback = (
      <OakFlex
        $position={"absolute"}
        $left={"space-between-m"}
        $flexDirection={"column"}
        $gap={"space-between-ssx"}
      >
        <OakSpan>mode: {questionState[currentQuestionIndex]?.mode}</OakSpan>
        <OakSpan>
          feedback:
          {questionState[currentQuestionIndex]?.grade === 1
            ? "correct"
            : "incorrect"}
        </OakSpan>
      </OakFlex>
    );
  }

  return (
    <OakFlex
      $flexDirection={"column"}
      $color="text-subdued"
      $minWidth={"all-spacing-24"}
      $pa={"inner-padding-xl"}
      $ba="border-solid-m"
      $borderColor={"border-inverted"}
      $background={"bg-decorative1-very-subdued"}
      $alignItems={"center"}
      $gap={"all-spacing-5"}
    >
      <OakHeading tag="h1">Quiz Renderer</OakHeading>

      {questionFeedback}
      {innerRender}
    </OakFlex>
  );
};
