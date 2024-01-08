import { useEffect, useState } from "react";
import {
  OakBox,
  OakRadioButton,
  OakRadioGroup,
} from "@oak-academy/oak-components";

import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";
import { useQuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";

export type QuizMCQSingleAnswerProps = {
  questionUid: string;
  answers: MCAnswer[];
};

export const QuizMCQSingleAnswer = (props: QuizMCQSingleAnswerProps) => {
  const { questionUid, answers } = props;

  const quizEngineContext = useQuizEngineContext();

  const currentQuestionIndex = quizEngineContext?.currentQuestionIndex || 0;
  const questionState = quizEngineContext?.questionState[currentQuestionIndex];

  const [selectedAnswer, setSelectedAnswer] = useState<
    MCAnswer | null | undefined
  >(null);

  useEffect(() => {
    if (questionState?.mode === "grading") {
      quizEngineContext?.handleSubmitMCAnswer(selectedAnswer);
    }
  }, [questionState, currentQuestionIndex, quizEngineContext, selectedAnswer]);

  if (!questionState) {
    return null;
  }

  const isFeedbackMode = questionState.mode === "feedback";

  return (
    <OakRadioGroup
      name={questionUid || "quiz"}
      $flexDirection={"column"}
      onChange={(e) => {
        const targetIndex = e.target.tabIndex;
        if (questionState?.mode === "init") {
          quizEngineContext?.updateQuestionMode("input");
        }
        setSelectedAnswer(answers[targetIndex]);
      }}
      disabled={isFeedbackMode}
    >
      {answers?.map((answer, i) => {
        return (
          <OakBox key={`radio-${i}`}>
            {answer.answer.map((answerItem) => {
              let feedbackModeColor: "oakGreen" | "red" | undefined;

              if (questionState.feedback?.[i] === "correct") {
                feedbackModeColor = "oakGreen";
              } else if (questionState.feedback?.[i] === "incorrect") {
                feedbackModeColor = "red";
              }

              const backgroundColor = isFeedbackMode
                ? feedbackModeColor
                : undefined;

              const color = backgroundColor ? "text-inverted" : undefined;

              const correctChoice = (
                <>
                  {answer.answer_is_correct && isFeedbackMode && (
                    <OakBox
                      $position={"absolute"}
                      $top={"all-spacing-3"}
                      $right={"all-spacing-3"}
                      $font={"body-3-bold"}
                      $color={color}
                    >
                      Correct choice
                    </OakBox>
                  )}
                </>
              );

              if (answerItem.type === "text") {
                return (
                  <OakBox key={`radio-${i}`} $position={"relative"}>
                    <OakRadioButton
                      key={`radio-${i}`}
                      $pa="inner-padding-s"
                      $ba={"border-solid-s"}
                      $borderRadius={"border-radius-s"}
                      $color={color}
                      $background={backgroundColor}
                      id={`radio-${i}`}
                      tabIndex={i}
                      value={`${questionUid}: ${answerItem.text}`} // we make this unique to the question to prevent selection on later questions
                      label={answerItem.text}
                    />
                    {correctChoice}
                  </OakBox>
                );
              }
            })}
          </OakBox>
        );
      })}
    </OakRadioGroup>
  );
};
