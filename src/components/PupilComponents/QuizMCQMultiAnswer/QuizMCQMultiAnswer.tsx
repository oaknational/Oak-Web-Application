/**
 *
 * This component is used to render the multiple choice question with multiple answers
 *
 */

// Test with
// http://localhost:3000/pupils/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/reading-complex-texts-about-crime-and-punishment#starter-quiz
// Multiple correct answers
// http://localhost:3000/pupils/programmes/maths-secondary-ks3/units/graphical-representations-of-data/lessons/constructing-bar-charts-by-utilising-technology#starter-quiz

import { useMemo, useRef } from "react";
import {
  OakFlex,
  OakImage,
  OakQuizCheckBox,
} from "@oak-academy/oak-components";

import {
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";

export type QuizMCQMultiAnswerProps = {
  onInitialChange?: () => void;
  onChange?: () => void;
};

export const QuizMCQMultiAnswer = (props: QuizMCQMultiAnswerProps) => {
  const { onInitialChange, onChange } = props;
  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionIndex, currentQuestionData } = quizEngineContext;
  const questionState = quizEngineContext?.questionState[currentQuestionIndex];
  const questionUid = currentQuestionData?.questionUid;

  const lastChanged = useRef<number>(0);

  const answers = useMemo(
    () => currentQuestionData?.answers?.["multiple-choice"] ?? [],
    [currentQuestionData],
  );

  if (!questionState || !currentQuestionData) {
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
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      {answers.map((answer, index) => {
        const filterByText = answer.answer.filter(
          (a) => a.type === "text",
        ) as StemTextObject[];
        const filterByImage = answer.answer.filter(
          (a) => a.type === "image",
        ) as StemImageObject[];
        const answerText = filterByText.length > 0 && filterByText[0];
        const answerImageData =
          filterByImage.length > 0 && filterByImage[0]?.image_object;

        const answerImage = answerImageData ? (
          <OakImage
            src={answerImageData.secure_url}
            alt=""
            width={answerImageData.width}
            height={answerImageData.height}
            $minWidth={"all-spacing-19"}
          />
        ) : undefined;

        const feedback =
          isFeedbackMode && Array.isArray(questionState.feedback)
            ? questionState.feedback[index]
            : undefined;

        return (
          <OakQuizCheckBox
            key={`${questionUid}-answer-${index}`}
            id={`${questionUid}-answer-${index}`}
            displayValue={answerText ? answerText.text : " "}
            value={`answer-${index}`}
            feedback={feedback}
            image={answerImage}
            onChange={handleOnChange}
          />
        );
      })}
    </OakFlex>
  );
};
