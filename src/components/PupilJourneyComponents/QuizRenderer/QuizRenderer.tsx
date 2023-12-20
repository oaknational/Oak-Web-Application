import { useContext, useState } from "react";
import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakSpan,
} from "@oak-academy/oak-components";

import { QuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { QuizQuestionStem } from "@/components/PupilJourneyComponents/QuizQuestionStem";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";
import { QuizMCQSingleAnswer } from "@/components/PupilJourneyComponents/QuizMCQSingleAnswer/QuizMCQSingleAnswer";

export const QuizRenderer = () => {
  const quizContext = useContext(QuizEngineContext);

  const [selectedAnswer, setSelectedAnswer] = useState<{
    answer?: MCAnswer | null;
    index: number;
  }>();

  if (quizContext === null) {
    return;
  }

  const {
    currentQuestionData,
    currentQuestionIndex,
    questionState,
    handleSubmitMCAnswer,
    handleNextQuestion,
  } = quizContext;

  if (!currentQuestionData) {
    return null;
  }

  const { questionStem, answers, questionUid } = currentQuestionData;

  const MCAnswers = answers?.["multiple-choice"];
  const isFeedbackMode = questionState.mode === "feedback";
  const isEndMode = questionState.mode === "end";
  const isInputMode = questionState.mode === "input";

  const handleAnswerSelected = (val: {
    answer?: MCAnswer | null;
    index: number;
  }) => {
    setSelectedAnswer(val);
  };

  let answerRender = null;

  if (MCAnswers && MCAnswers?.length > 0) {
    answerRender = (
      <QuizMCQSingleAnswer
        questionUid={questionUid}
        currentQuestionIndex={currentQuestionIndex}
        answers={MCAnswers}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={handleAnswerSelected}
        isFeedbackMode={isFeedbackMode}
      />
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
      $background={"bg-decorative1-subdued"}
      $alignItems={"center"}
      $gap={"all-spacing-5"}
    >
      <OakHeading tag="h1">Quiz Renderer</OakHeading>
      <OakSpan>mode: {questionState.mode}</OakSpan>
      <OakSpan>answer: {questionState.answer || "not answered"}</OakSpan>

      {isEndMode && (
        <OakFlex>
          <OakSpan>
            End of quiz, score: {questionState.score}/
            {questionState.maximumScore}
          </OakSpan>
        </OakFlex>
      )}

      {(isInputMode || isFeedbackMode) && (
        <OakFlex $flexDirection={"column"} $gap={"all-spacing-5"}>
          <QuizQuestionStem
            questionStem={questionStem}
            index={currentQuestionIndex}
            showIndex={true}
          />
          {answerRender}
          {isInputMode && (
            <OakFlex $pt="inner-padding-l">
              <OakPrimaryButton
                disabled={selectedAnswer === undefined}
                onClick={() => {
                  handleSubmitMCAnswer(selectedAnswer?.answer);
                }}
              >
                Submit
              </OakPrimaryButton>
            </OakFlex>
          )}
          {isFeedbackMode && (
            <OakFlex $pt="inner-padding-l">
              <OakPrimaryButton
                onClick={() => {
                  handleNextQuestion();
                  setSelectedAnswer(undefined);
                }}
              >
                Next Question
              </OakPrimaryButton>
            </OakFlex>
          )}
        </OakFlex>
      )}
    </OakFlex>
  );
};
