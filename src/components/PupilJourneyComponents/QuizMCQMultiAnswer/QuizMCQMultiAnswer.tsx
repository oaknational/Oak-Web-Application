/**
 *
 * This component is used to render the multiple choice question with multiple answers
 *
 */

// Test with
// http://localhost:3000/pupils/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/reading-complex-texts-about-crime-and-punishment#starter-quiz
// Multiple correct answers
// http://localhost:3000/pupils/programmes/maths-secondary-ks3/units/graphical-representations-of-data/lessons/constructing-bar-charts-by-utilising-technology#starter-quiz

import { RefObject, useEffect, useMemo, useRef } from "react";
import {
  OakFlex,
  OakImage,
  OakQuizCheckBox,
} from "@oak-academy/oak-components";

import {
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { useQuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";

export type QuizMCQMultiAnswerProps = {
  answerRefs?: RefObject<HTMLInputElement>[];
  onInitialChange?: () => void;
  onChange?: () => void;
};

export const QuizMCQMultiAnswer = (props: QuizMCQMultiAnswerProps) => {
  const { answerRefs, onInitialChange, onChange } = props;
  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionIndex, currentQuestionData } = quizEngineContext;
  const questionState = quizEngineContext?.questionState[currentQuestionIndex];
  const questionUid = currentQuestionData?.questionUid;

  const lastChanged = useRef<number>(0);

  useEffect(() => {
    lastChanged.current = 0;
  }, [currentQuestionIndex]);

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

        const feedback = isFeedbackMode
          ? questionState.feedback?.[index]
          : undefined;

        return (
          <OakQuizCheckBox
            key={`${questionUid}-answer${index}`}
            id={`${questionUid}-answer${index}`}
            value={answerText ? answerText.text : ""}
            feedback={feedback}
            image={answerImage}
            innerRef={answerRefs?.[index]}
            onChange={handleOnChange}
          />
        );
      })}
    </OakFlex>
  );
};
