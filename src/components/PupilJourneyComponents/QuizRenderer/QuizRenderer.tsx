import { useContext, useState } from "react";
import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakRadioGroup,
  OakRadioButton,
  OakSpan,
  OakBox,
} from "@oak-academy/oak-components";

import { QuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { QuestionStem } from "@/components/PupilJourneyComponents/QuestionStem";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

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

  return (
    <OakFlex
      $flexDirection={"column"}
      $color="text-subdued"
      $minWidth={"all-spacing-24"}
      $pa={"inner-padding-xl"}
      $ba="border-solid-m"
      $borderColor={"border-inverted"}
      $background={"bg-decorative2-subdued"}
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
          <QuestionStem
            questionStem={questionStem}
            index={currentQuestionIndex}
            showIndex={true}
          />
          <OakRadioGroup
            name={questionUid || "quiz"}
            $flexDirection={"column"}
            onChange={(e) => {
              const targetIndex = e.target.tabIndex;
              const selectedAnswer = MCAnswers?.[targetIndex];
              setSelectedAnswer({
                answer: selectedAnswer,
                index: targetIndex,
              });
            }}
            disabled={isFeedbackMode}
          >
            {MCAnswers?.map((answer, i) => {
              return (
                <OakBox key={`radio-${i}`}>
                  {answer.answer.map((answerItem) => {
                    const isSelected = selectedAnswer?.index === i;
                    const incorrectColor = isSelected ? "red" : undefined;

                    const feedbackModeColor = answer.answer_is_correct
                      ? "oakGreen"
                      : incorrectColor;

                    const backgroundColor = isFeedbackMode
                      ? feedbackModeColor
                      : undefined;

                    const color = backgroundColor ? "text-inverted" : undefined;

                    if (answerItem.type === "text") {
                      return (
                        <OakRadioButton
                          key={`radio-${i}`}
                          $pa="inner-padding-s"
                          $ba={"border-solid-s"}
                          $borderRadius={"border-radius-s"}
                          $color={color}
                          $background={backgroundColor}
                          id={`radio-${i}`}
                          tabIndex={i}
                          value={`${currentQuestionIndex}${answerItem.text}`}
                          label={answerItem.text}
                        />
                      );
                    }
                  })}
                </OakBox>
              );
            })}
          </OakRadioGroup>
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
