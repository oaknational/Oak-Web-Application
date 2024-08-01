import React from "react";

import {
  OakFlex,
  OakQuizResultItem,
  OakSpan,
} from "@oaknational/oak-components";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

export type QuizResultShortAnswerProps = {
  answers: string | (string | undefined)[];
  pupilAnswers: string;
};

export const QuizResultShortAnswer = ({
  answers,
  pupilAnswers,
}: QuizResultShortAnswerProps) => {
  const feedbackState = (() => {
    switch (true) {
      case answers.includes(pupilAnswers):
        return "correct";
      case pupilAnswers === answers:
        return "correct";
      case pupilAnswers !== answers:
        return "incorrect";
      default:
        return null;
    }
  })();

  //   const imageURL =
  //     isImage(image) && image?.imageObject?.secureUrl
  //       ? image.imageObject.secureUrl
  //       : undefined;

  //   const standardText = isText(text) && text?.text ? text.text : undefined;

  // return
  const resultItems = (
    <MathJaxWrap>
      <OakQuizResultItem
        key={pupilAnswers}
        standardText={pupilAnswers}
        feedbackState={feedbackState}
      />
    </MathJaxWrap>
  );

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakSpan $font={"body-3-bold"}>Your answer:</OakSpan>
      {resultItems}
    </OakFlex>
  );
};
