/**
 *
 * This component is used to render the multiple choice question with multiple answers
 *
 */

// Test with
// http://localhost:3000/pupils/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/reading-complex-texts-about-crime-and-punishment#starter-quiz
// Multiple correct answers
// http://localhost:3000/pupils/programmes/maths-secondary-ks3/units/graphical-representations-of-data/lessons/constructing-bar-charts-by-utilising-technology#starter-quiz

import { useMemo, useState } from "react";
import {
  OakCloudinaryImage,
  OakFlex,
  OakJauntyAngleLabel,
  OakQuizCheckBox,
  OakScaleImageButton,
} from "@oaknational/oak-components";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import {
  isImage,
  isText,
} from "@/components/PupilComponents/QuizUtils/stemUtils";
import { Stem } from "@/components/SharedComponents/Stem";
export type QuizMCQMultiAnswerProps = {
  onChange: () => void;
};

export const multipleChoiceAnswerId = (
  questionUid: string | undefined,
  index: number,
) => {
  return `${questionUid}-answer-${index}`;
};
export const QuizMCQMultiAnswer = ({ onChange }: QuizMCQMultiAnswerProps) => {
  const quizEngineContext = useQuizEngineContext();
  const lessonEngineContext = useLessonEngineContext();
  const { currentQuestionIndex, currentQuestionData } = quizEngineContext;
  const { currentSection } = lessonEngineContext;
  const questionState = quizEngineContext?.questionState[currentQuestionIndex];
  const questionUid = currentQuestionData?.questionUid;
  const numCorrectAnswers = currentQuestionData?.answers?.[
    "multiple-choice"
  ]?.filter((a) => a.answerIsCorrect === true).length;
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
  if (!questionState || !currentQuestionData) {
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
          label={`Select ${numCorrectAnswers} answers`}
        />
      </OakFlex>
      <OakFlex
        $flexDirection={"column"}
        $gap={"space-between-s"}
        role={"group"}
        aria-labelledby={`${questionUid}-legend`}
      >
        {answers.map((answer, index) => {
          const filterByText = answer.answer.filter(isText);
          const filterByImage = answer.answer.filter(isImage);
          const answerText = filterByText.length > 0 && filterByText[0];
          const answerImageData =
            filterByImage.length > 0 && filterByImage[0]?.imageObject;

          const answerImage =
            answerImageData && answerImageData.publicId ? (
              <OakFlex>
                <OakCloudinaryImage
                  cloudinaryId={answerImageData.publicId}
                  alt="An image in a quiz"
                  width={answerImageData.width}
                  height={answerImageData.height}
                  $minWidth={
                    scaled[index] ? "all-spacing-20" : "all-spacing-19"
                  }
                  placeholder="oak"
                  sizes={getSizes(["100vw", 1200])}
                  role="presentation"
                />
                <OakFlex
                  $width={"all-spacing-7"}
                  $height={"all-spacing-7"}
                  $pointerEvents={"auto"}
                  $display={["none", "flex"]}
                >
                  <OakScaleImageButton
                    onImageScaleCallback={(e) => {
                      e.stopPropagation();
                      handleSetScale(index, !scaled[index]);
                    }}
                    isExpanded={scaled[index] ? true : false}
                  />
                </OakFlex>
              </OakFlex>
            ) : undefined;

          const feedback =
            isFeedbackMode && Array.isArray(questionState.feedback)
              ? questionState.feedback[index]
              : undefined;

          return (
            <MathJaxWrap key={`max-jax-wrap-${index}`}>
              <OakQuizCheckBox
                key={`${questionUid}-answer-${index}`}
                id={multipleChoiceAnswerId(questionUid, index)}
                displayValue={answerText ? <Stem stem={answerText} /> : " "}
                value={`answer-${index}`}
                feedback={feedback}
                image={answerImage}
                onChange={onChange}
                isHighlighted={questionState.mode === "incomplete"}
              />
            </MathJaxWrap>
          );
        })}
      </OakFlex>
    </OakFlex>
  );
};
