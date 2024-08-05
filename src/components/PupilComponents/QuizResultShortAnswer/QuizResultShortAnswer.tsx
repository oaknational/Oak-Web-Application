import React from "react";
import {
  OakFlex,
  OakQuizResultItem,
  OakSpan,
} from "@oaknational/oak-components";

import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

export type QuizResultShortAnswerProps = {
  answers: string | (string | undefined)[];
  pupilAnswer: string;
};

export const QuizResultShortAnswer = ({
  answers,
  pupilAnswer,
}: QuizResultShortAnswerProps) => {
  const feedbackState = (() => {
    switch (true) {
      case pupilAnswer === answers:
        return "correct";
      case answers.includes(pupilAnswer):
        return "correct";
      case pupilAnswer !== answers:
        return "incorrect";
    }
  })();

  const resultItem = (
    <MathJaxWrap>
      <OakQuizResultItem
        key={pupilAnswer}
        standardText={pupilAnswer}
        feedbackState={feedbackState}
      />
    </MathJaxWrap>
  );

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakSpan $font={"body-3-bold"}>Your answer:</OakSpan>
      {resultItem}
    </OakFlex>
  );
};
