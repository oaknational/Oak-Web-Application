import { useMemo, RefObject, useRef, useEffect } from "react";
import {
  OakBox,
  OakRadioButton,
  OakRadioGroup,
} from "@oak-academy/oak-components";

import { useQuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";

export type QuizMCQSingleAnswerProps = {
  answerRefs?: RefObject<HTMLInputElement>[];
  onInitialChange?: () => void;
  onChange?: () => void;
};

export const QuizMCQSingleAnswer = (props: QuizMCQSingleAnswerProps) => {
  const { answerRefs, onInitialChange, onChange } = props;
  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionIndex, currentQuestionData } = quizEngineContext;
  const answers = useMemo(
    () => currentQuestionData?.answers?.["multiple-choice"] ?? [],
    [currentQuestionData],
  );
  const questionState = quizEngineContext.questionState[currentQuestionIndex];
  const questionUid = currentQuestionData?.questionUid;

  const lastChanged = useRef<number>(0);

  useEffect(() => {
    lastChanged.current = 0;
  }, [currentQuestionIndex]);

  if (!questionState) {
    return null;
  }

  const handleOnChange = () => {
    console.log("handleOnChange", lastChanged.current);
    if (lastChanged.current === 0 && onInitialChange) {
      onInitialChange();
    } else if (lastChanged.current !== 0 && onChange) {
      onChange();
    }
    lastChanged.current = Date.now();
  };

  const isFeedbackMode = questionState.mode === "feedback";

  return (
    <OakRadioGroup
      name={questionUid || "quiz"}
      $flexDirection={"column"}
      onChange={handleOnChange}
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
                      ref={answerRefs?.[i]}
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
