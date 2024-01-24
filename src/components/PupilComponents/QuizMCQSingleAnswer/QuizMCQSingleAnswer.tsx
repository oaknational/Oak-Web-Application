import { useMemo } from "react";
import {
  OakRadioGroup,
  OakQuizRadioButton,
  OakSpan,
  OakFlex,
} from "@oak-academy/oak-components";

import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { useInitialChange } from "@/components/PupilComponents/QuizUtils/useInitialChange";
import {
  getStemImage,
  isText,
} from "@/components/PupilComponents/QuizUtils/stemUtils";

// testing
//text only
//http://localhost:3000/pupils/programmes/combined-science-secondary-ks4-foundation-aqa/units/measuring-waves/lessons/transverse-waves
//with images
//http://localhost:3000/pupils/programmes/science-primary-ks2/units/earth-sun-and-moon/lessons/why-we-have-day-and-night#starter-quiz

export type QuizMCQSingleAnswerProps = {
  onInitialChange?: () => void;
  onChange?: () => void;
};

export const QuizMCQSingleAnswer = (props: QuizMCQSingleAnswerProps) => {
  const { onInitialChange, onChange } = props;

  const { handleOnChange } = useInitialChange({ onChange, onInitialChange });

  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionIndex, currentQuestionData } = quizEngineContext;
  const answers = useMemo(
    () => currentQuestionData?.answers?.["multiple-choice"] ?? [],
    [currentQuestionData],
  );
  const questionState = quizEngineContext.questionState[currentQuestionIndex];
  const questionUid = currentQuestionData?.questionUid;

  if (!questionState) {
    return null;
  }

  const isFeedbackMode = questionState.mode === "feedback";

  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={["space-between-m", "space-between-m", "space-between-m2"]}
    >
      <OakSpan>Select one answer</OakSpan>
      <OakRadioGroup
        name={questionUid || "mcq-single-answer"}
        $flexDirection={"column"}
        $gap={"space-between-s"}
        onChange={handleOnChange}
        disabled={isFeedbackMode}
      >
        {answers?.map((answer, i) => {
          const label = answer.answer.find(isText);

          const image = getStemImage({
            stem: answer.answer,
            minWidth: "all-spacing-19",
          });

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
              image={image}
            />
          );
        })}
      </OakRadioGroup>{" "}
    </OakFlex>
  );
};
