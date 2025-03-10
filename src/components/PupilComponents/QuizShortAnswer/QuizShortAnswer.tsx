import {
  OakFlex,
  OakJauntyAngleLabel,
  OakLabel,
  OakQuizTextInput,
} from "@oaknational/oak-components";

import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

// for testing
// http://localhost:3000/pupils/programmes/english-primary-ks2/units/crazy-about-cats-reading/lessons/analysing-use-of-language-in-crazy-about-cats#starter-quiz

export const shortAnswerInputId = (questionUid: string | undefined) => {
  return `short-answer-${questionUid}`;
};

export type QuizShortAnswerProps = {
  onChange: () => void;
};

export const QuizShortAnswer = ({ onChange }: QuizShortAnswerProps) => {
  const quizEngineContext = useQuizEngineContext();
  const lessonEngineContext = useLessonEngineContext();
  const { currentQuestionIndex, currentQuestionData } = quizEngineContext;
  const questionState = quizEngineContext?.questionState[currentQuestionIndex];
  const questionUid = currentQuestionData?.questionUid;

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
      <OakLabel htmlFor={`short-answer-${questionUid}`}>
        <OakFlex
          $mt={["space-between-s", "space-between-l", "space-between-xl"]}
        >
          <OakJauntyAngleLabel
            $background={
              lessonEngineContext.currentSection === "starter-quiz"
                ? "bg-decorative1-main"
                : "bg-decorative5-main"
            }
            $color={"text-primary"}
            label="Type your answer here"
          />
        </OakFlex>
      </OakLabel>
      <OakQuizTextInput
        id={shortAnswerInputId(questionUid)}
        key={`short-answer-${questionUid}`}
        name={`short-answer-${questionUid}`}
        onChange={onChange}
        feedback={feedback}
        wrapperWidth={["100%", "all-spacing-22"]}
        isHighlighted={questionState.mode === "incomplete"}
      />
    </OakFlex>
  );
};
