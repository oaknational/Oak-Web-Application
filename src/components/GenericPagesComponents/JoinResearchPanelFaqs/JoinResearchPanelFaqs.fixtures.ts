import { JoinResearchPanelFaqsProps } from "./JoinResearchPanelFaqs";

import { portableTextFromString } from "@/__tests__/__helpers__/cms";

export const basic: JoinResearchPanelFaqsProps = {
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
