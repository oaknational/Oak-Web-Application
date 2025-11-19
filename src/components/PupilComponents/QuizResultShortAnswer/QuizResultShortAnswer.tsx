import React from "react";
import {
  OakFlex,
  OakQuizResultItem,
  OakSpan,
} from "@oaknational/oak-components";

import { QuestionFeedbackType } from "@/components/PupilComponents/QuizUtils/questionTypes";

export type QuizResultShortAnswerProps = {
  pupilAnswer: string;
  feedback: QuestionFeedbackType;
};

export const QuizResultShortAnswer = ({
  pupilAnswer,
  feedback,
}: QuizResultShortAnswerProps) => {
  const resultItem = (
    <OakQuizResultItem
      key={pupilAnswer}
      standardText={pupilAnswer}
      feedbackState={feedback}
    />
  );

  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
      <OakSpan $font={"body-3-bold"}>Your answer:</OakSpan>
      {resultItem}
    </OakFlex>
  );
};
