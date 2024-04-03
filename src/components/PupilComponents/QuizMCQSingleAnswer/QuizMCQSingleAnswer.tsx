import { useMemo } from "react";
import {
  OakRadioGroup,
  OakQuizRadioButton,
  OakSpan,
  OakFlex,
} from "@oaknational/oak-components";

import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import {
  getStemImage,
  isText,
} from "@/components/PupilComponents/QuizUtils/stemUtils";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

// testing
//text only
//http://localhost:3000/pupils/programmes/combined-science-secondary-ks4-foundation-aqa/units/measuring-waves/lessons/transverse-waves
//with images
//http://localhost:3000/pupils/programmes/science-primary-ks2/units/earth-sun-and-moon/lessons/why-we-have-day-and-night#starter-quiz

export type QuizMCQSingleAnswerProps = {
  onChange: () => void;
};

export const QuizMCQSingleAnswer = (props: QuizMCQSingleAnswerProps) => {
  const { onChange } = props;
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
    <OakFlex $flexDirection={"column"} $gap={"space-between-m"}>
      <OakSpan
        $font={["heading-light-7", "heading-light-6", "heading-light-6"]}
      >
        Select one answer
      </OakSpan>
      <OakRadioGroup
        name={questionUid || "mcq-single-answer"}
        $flexDirection={"column"}
        $gap={"space-between-s"}
        onChange={onChange}
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
              label={<MathJaxWrap>{label?.text}</MathJaxWrap>}
              feedback={feedback}
              image={image}
              isHighlighted={questionState?.mode === "incomplete"}
            />
          );
        })}
      </OakRadioGroup>
    </OakFlex>
  );
};
