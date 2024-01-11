import { useMemo, useRef, useEffect } from "react";

import { OakRadioGroup, OakQuizRadioButton } from "@oak-academy/oak-components";
import { useQuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { StemTextObject } from "@/node-lib/curriculum-api-2023/shared.schema";

export type QuizMCQSingleAnswerProps = {
  onInitialChange?: () => void;
  onChange?: () => void;
};

export const QuizMCQSingleAnswer = (props: QuizMCQSingleAnswerProps) => {
  const { onInitialChange, onChange } = props;
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
      name={questionUid || "mcq-single-answer"}
      $flexDirection={"column"}
      onChange={handleOnChange}
      disabled={isFeedbackMode}
    >
      {answers?.map((answer, i) => {
        const label = answer.answer.find((a) => a.type === "text") as
          | StemTextObject
          | undefined;

        const feedback = Array.isArray(questionState.feedback)
          ? questionState.feedback[i]
          : undefined;

        return (
          <OakQuizRadioButton
            id={`${questionUid}-answer-${i}`}
            key={`${questionUid}-answer-${i}`}
            tabIndex={i}
            value={`${questionUid}: ${i}`} // we make this unique to the question to prevent selection on later questions
            label={label?.text}
            feedback={feedback}
          />
        );
      })}
    </OakRadioGroup>
  );
};
