import { useMemo, useState } from "react";
import {
  OakRadioGroup,
  OakQuizRadioButton,
  OakFlex,
  OakJauntyAngleLabel,
  OakScaleImageButton,
} from "@oaknational/oak-components";

import { CodeRenderWrapper } from "../CodeRendererWrapper/CodeRendererWrapper";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import {
  getStemImage,
  isImage,
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
  const lessonEngineContext = useLessonEngineContext();
  const { currentQuestionIndex, currentQuestionData } = quizEngineContext;
  const { currentSection } = lessonEngineContext;
  const answers = useMemo(
    () => currentQuestionData?.answers?.["multiple-choice"] ?? [],
    [currentQuestionData],
  );
  const [scaled, setScaled] = useState<boolean[]>(answers.map(() => false));
  const handleSetScale = (index: number, newValue: boolean) => {
    setScaled((prevStates) =>
      prevStates.map((state, i) => (i === index ? newValue : state)),
    );
  };
  const questionState = quizEngineContext.questionState[currentQuestionIndex];
  const questionUid = currentQuestionData?.questionUid;

  if (!questionState) {
    return null;
  }

  const isFeedbackMode = questionState.mode === "feedback";

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-m"}>
      <OakFlex $mt={["space-between-s", "space-between-l", "space-between-xl"]}>
        <OakJauntyAngleLabel
          $background={
            currentSection === "starter-quiz"
              ? "bg-decorative1-main"
              : "bg-decorative5-main"
          }
          $color={"text-primary"}
          label="Select one answer"
        />
      </OakFlex>

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
            stem: answer.answer.filter(isImage),
            minWidth: "all-spacing-19",
            scaled: scaled[i] ? true : false,
          });
          const ResizeableImage = image ? (
            <OakFlex>
              {image}
              <OakFlex
                $width={"all-spacing-7"}
                $height={"all-spacing-7"}
                $pointerEvents={"auto"}
                $display={["none", "flex"]}
              >
                <OakScaleImageButton
                  onImageScaleCallback={(e) => {
                    e.stopPropagation();
                    handleSetScale(i, !scaled[i]);
                  }}
                  isExpanded={scaled[i] ? true : false}
                />
              </OakFlex>
            </OakFlex>
          ) : undefined;

          const feedback = Array.isArray(questionState.feedback)
            ? questionState.feedback[i]
            : undefined;

          return (
            <OakQuizRadioButton
              id={`${questionUid}-answer-${i}`}
              key={`${questionUid}-answer-${i}`}
              value={`${questionUid}: ${i}`} // we make this unique to the question to prevent selection on later questions
              label={
                <CodeRenderWrapper>
                  <MathJaxWrap>{label?.text}</MathJaxWrap>
                </CodeRenderWrapper>
              }
              feedback={feedback}
              image={ResizeableImage}
              isHighlighted={questionState?.mode === "incomplete"}
            />
          );
        })}
      </OakRadioGroup>
    </OakFlex>
  );
};
