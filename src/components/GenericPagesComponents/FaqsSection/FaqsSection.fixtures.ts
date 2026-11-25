import { FaqsSectionProps } from "./FaqsSection";

import { portableTextFromString } from "@/__tests__/__helpers__/cms";

export const basic: FaqsSectionProps = {
  items: [
    {
      question: "Question 1",
      answerRaw: portableTextFromString("Answer 1"),
    },
    {
      question: "Question 2",
      answerRaw: portableTextFromString("Answer 2"),
    },
    {
      question: "Question 3",
      answerRaw: portableTextFromString("Answer 3"),
    },
  ],
};
