import React from "react";
import {
  OakFlex,
  OakQuizResultItem,
  OakSpan,
} from "@oaknational/oak-components";

import { isImage } from "../QuizUtils/stemUtils";

import { MCAnswer } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { PupilAnswerMCQ } from "@/components/PupilComponents/QuizUtils/questionTypes";

export type QuizResultMCQProps = {
  answers: MCAnswer[];
  pupilAnswers: PupilAnswerMCQ;
};

export const QuizResultMCQ = ({
  answers,
  pupilAnswers,
}: QuizResultMCQProps) => {
  const resultItems = answers.map((answer, index) => {
    const text = answer.answer.filter((answer) => answer?.type === "text")[0];
    const image = answer.answer.filter((answer) => answer?.type === "image")[0];
    const answerSelected = Array.isArray(pupilAnswers)
      ? pupilAnswers.includes(index)
      : pupilAnswers === index;

    const feedbackState = (() => {
      switch (true) {
        case answerSelected && !answer.answerIsCorrect:
          return "incorrect";
        case answerSelected && answer.answerIsCorrect:
          return "correct";
        default:
          return null;
      }
    })();

    const imageURL =
      isImage(image) && image?.imageObject?.secureUrl
        ? image?.imageObject?.secureUrl
        : undefined;

    const standardText = isText(text) && text?.text ? text?.text : undefined;

    return (
      <OakQuizResultItem
        key={index}
        standardText={standardText}
        imageURL={imageURL}
        imageAlt={"Image for option " + (index + 1)}
        feedbackState={feedbackState}
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
