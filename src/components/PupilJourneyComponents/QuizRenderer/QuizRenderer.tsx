import { useContext } from "react";
import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakSpan,
} from "@oak-academy/oak-components";

import { QuizMCQMultiAnswer } from "../QuizMCQMultiAnswer";

import { QuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { QuizQuestionStem } from "@/components/PupilJourneyComponents/QuizQuestionStem";
import { QuizMCQSingleAnswer } from "@/components/PupilJourneyComponents/QuizMCQSingleAnswer/QuizMCQSingleAnswer";

export const QuizRenderer = () => {
  const quizContext = useContext(QuizEngineContext);

  if (quizContext === null) {
    return;
  }

  const {
    currentQuestionData,
    currentQuestionIndex,
    questionState,
    isComplete,
    score,
    maxScore,
    handleNextQuestion,
    updateQuestionMode,
  } = quizContext;

  let innerRender = null;

  let questionFeedback = null;

  if (isComplete) {
    innerRender = (
      <OakFlex>
        <OakSpan>
          End of quiz, score: {score}/{maxScore}
        </OakSpan>
      </OakFlex>
    );
  } else if (currentQuestionData) {
    const { questionStem, answers, questionUid } = currentQuestionData;

    const MCAnswers = answers?.["multiple-choice"];
    const isFeedbackMode =
      questionState[currentQuestionIndex]?.mode === "feedback";

    let answerRender = null;

    if (MCAnswers) {
      if (MCAnswers.filter((a) => a.answer_is_correct).length > 1) {
        answerRender = (
          <QuizMCQMultiAnswer questionUid={questionUid} answers={MCAnswers} />
        );
      } else {
        answerRender = (
          <QuizMCQSingleAnswer questionUid={questionUid} answers={MCAnswers} />
        );
      }
    }

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
              onClick={() => {
                updateQuestionMode("grading");
              }}
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
