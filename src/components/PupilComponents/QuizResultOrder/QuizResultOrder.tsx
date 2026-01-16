import {
  OakFlex,
  OakQuizResultItem,
  OakSpan,
} from "@oaknational/oak-components";

import {
  PupilAnswerOrder,
  QuestionFeedbackType,
} from "@/components/PupilComponents/QuizUtils/questionTypes";
import { OrderAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export type QuizResultOrderProps = {
  answers: OrderAnswer[];
  feedback: QuestionFeedbackType[];
  pupilAnswers: PupilAnswerOrder;
};

export const QuizResultOrder = ({
  answers,
  feedback,
  pupilAnswers,
}: QuizResultOrderProps) => {
  const resultItems = pupilAnswers.map((pupilAnswer, index) => {
    // for order questions the pupil answers are 1-indexed
    const answer = answers[pupilAnswer - 1];

    if (!answer) {
      throw new Error(`Answer not found for index ${pupilAnswer}`);
    }

    const feedbackState = feedback[index];
    const standardText = answer.answer.find(
      (answer) => answer?.type === "text",
    )?.text;

    if (!standardText) {
      throw new Error("Text is missing from order answer");
    }

    return (
      <OakQuizResultItem
        key={`${standardText?.trim()}-${index}`}
        boldPrefixText={`${pupilAnswer}`}
        standardText={standardText}
        feedbackState={feedbackState}
      />
    );
  });

  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
      <OakSpan $font={"body-3-bold"}>Your answer:</OakSpan>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        {resultItems}
      </OakFlex>
    </OakFlex>
  );
};
