import React from "react";
import {
  OakFlex,
  OakQuizResultItem,
  OakSpan,
} from "@oaknational/oak-components";

import { MCAnswer } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { QuestionFeedbackType } from "@/components/PupilComponents/QuizUtils/questionTypes";
import {
  isImage,
  isText,
} from "@/components/PupilComponents/QuizUtils/stemUtils";

export type QuizResultMCQProps = {
  answers: MCAnswer[];
  feedback: QuestionFeedbackType[];
  pupilAnswer: number[];
};

export const QuizResultMCQ = ({
  answers,
  feedback,
  pupilAnswer,
}: QuizResultMCQProps) => {
  const mappedFeedback = feedback.map((mark, index) =>
    pupilAnswer.includes(index) ? mark : null,
  );

  const resultItems = answers.map((answer, index) => {
    const text = answer.answer.filter((answer) => answer?.type === "text")[0];
    const image = answer.answer.filter((answer) => answer?.type === "image")[0];

    const feedbackState = mappedFeedback[index];

    const imageURL =
      isImage(image) && image?.imageObject?.secureUrl
        ? image.imageObject.secureUrl
        : undefined;

    const standardText = isText(text) && text?.text ? text.text : undefined;

    return (
      <OakQuizResultItem
        key={index}
        standardText={standardText}
        imageURL={imageURL}
        imageAlt={"Image for option " + (index + 1)}
        feedbackState={feedbackState}
        aria-role="listItem"
      />
    );
  });

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakSpan $font={"body-3-bold"}>Your answer:</OakSpan>
      {resultItems}
    </OakFlex>
  );
};
