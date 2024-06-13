/**
 *
 * This component is used to render the multiple choice question with multiple answers
 *
 */

// Test with
// http://localhost:3000/pupils/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/reading-complex-texts-about-crime-and-punishment#starter-quiz
// Multiple correct answers
// http://localhost:3000/pupils/programmes/maths-secondary-ks3/units/graphical-representations-of-data/lessons/constructing-bar-charts-by-utilising-technology#starter-quiz

import { useMemo } from "react";
import {
  OakCloudinaryImage,
  OakFlex,
  OakQuizCheckBox,
  OakSpan,
} from "@oaknational/oak-components";

import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import {
  isImage,
  isText,
} from "@/components/PupilComponents/QuizUtils/stemUtils";

export type QuizMCQMultiAnswerProps = {
  onChange: () => void;
};

export const QuizMCQMultiAnswer = ({ onChange }: QuizMCQMultiAnswerProps) => {
  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionIndex, currentQuestionData } = quizEngineContext;
  const questionState = quizEngineContext?.questionState[currentQuestionIndex];
  const questionUid = currentQuestionData?.questionUid;
  const numCorrectAnswers = currentQuestionData?.answers?.[
    "multiple-choice"
  ]?.filter((a) => a.answerIsCorrect === true).length;
  const answers = useMemo(
    () => currentQuestionData?.answers?.["multiple-choice"] ?? [],
    [currentQuestionData],
  );

  if (!questionState || !currentQuestionData) {
    return null;
  }

  const isFeedbackMode = questionState.mode === "feedback";

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-m"}>
      <OakSpan
        $font={["heading-light-7", "heading-light-6", "heading-light-6"]}
      >
        Select {numCorrectAnswers} answers
      </OakSpan>
      <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
        {answers.map((answer, index) => {
          const filterByText = answer.answer.filter(isText);
          const filterByImage = answer.answer.filter(isImage);
          const answerText = filterByText.length > 0 && filterByText[0];
          const answerImageData =
            filterByImage.length > 0 && filterByImage[0]?.imageObject;

          const answerImage =
            answerImageData && answerImageData.publicId ? (
              <OakCloudinaryImage
                cloudinaryId={answerImageData.publicId}
                alt=""
                width={answerImageData.width}
                height={answerImageData.height}
                $minWidth={"all-spacing-19"}
                placeholder="oak"
                sizes={getSizes(["100vw", 1200])}
              />
            ) : undefined;

          const feedback =
            isFeedbackMode && Array.isArray(questionState.feedback)
              ? questionState.feedback[index]
              : undefined;

          return (
            <MathJaxWrap>
              <OakQuizCheckBox
                key={`${questionUid}-answer-${index}`}
                id={`${questionUid}-answer-${index}`}
                displayValue={answerText ? answerText.text : " "}
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
