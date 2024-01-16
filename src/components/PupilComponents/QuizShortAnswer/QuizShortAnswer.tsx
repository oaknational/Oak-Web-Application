import {
  OakFlex,
  OakLabel,
  OakQuizTextInput,
} from "@oak-academy/oak-components";

<<<<<<< HEAD:src/components/PupilComponents/QuizShortAnswer/QuizShortAnswer.tsx
import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
=======
import { useQuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { useInitialChange } from "@/components/PupilJourneyComponents/QuizUtils/useInitialChange";
>>>>>>> main:src/components/PupilJourneyComponents/QuizShortAnswer/QuizShortAnswer.tsx

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

  const { handleOnChange } = useInitialChange({ onChange, onInitialChange });

  if (!questionState || !currentQuestionData) {
    return null;
  }

  const feedback =
    questionState.mode === "feedback" &&
    typeof questionState.feedback === "string"
      ? questionState.feedback
      : undefined;

  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={"space-between-m"}
      $font={"body-1"}
    >
      <OakLabel
        htmlFor={`short-answer-${questionUid}`}
        $font={["heading-light-7", "heading-light-6", "heading-light-6"]}
        $color={"text-subdued"}
      >
        Type your answer here
      </OakLabel>
      <OakQuizTextInput
        id={`short-answer-${questionUid}`}
        key={`short-answer-${questionUid}`}
        name={`short-answer-${questionUid}`}
        onChange={handleOnChange}
        feedback={feedback}
      />
    </OakFlex>
  );
};
