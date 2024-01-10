import { useMemo, useRef } from "react";
import { OakFlex, OakQuizTextInput } from "@oak-academy/oak-components";

import { useQuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";

// for testing
// http://localhost:3000/pupils/programmes/english-primary-ks2/units/crazy-about-cats-reading/lessons/analysing-use-of-language-in-crazy-about-cats#starter-quiz

export type QuizShortAnswerProps = {
  onInitialChange?: () => void;
  onChange?: () => void;
};

export const QuizShortAnswer = (props: QuizShortAnswerProps) => {
  const { onInitialChange, onChange } = props;

  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionIndex, currentQuestionData } = quizEngineContext;
  const questionState = quizEngineContext?.questionState[currentQuestionIndex];
  const questionUid = currentQuestionData?.questionUid;

  const lastChanged = useRef<number>(0);

  const handleOnChange = () => {
    if (lastChanged.current === 0 && onInitialChange) {
      onInitialChange();
    } else if (lastChanged.current !== 0 && onChange) {
      onChange();
    }
    lastChanged.current = Date.now();
  };

  if (!questionState || !currentQuestionData) {
    return null;
  }

  return (
    <OakFlex>
      <OakQuizTextInput />
    </OakFlex>
  );
};
