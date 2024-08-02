import {
  OakFlex,
  OakQuizResultItem,
  OakSpan,
} from "@oaknational/oak-components";

import { OrderAnswer } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import {
  PupilAnswerOrder,
  QuestionFeedbackType,
} from "@/components/PupilComponents/QuizUtils/questionTypes";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

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
    const answer = answers[pupilAnswer];

    if (!answer) {
      throw new Error(`Answer not found for index ${pupilAnswer}`);
    }

    const feedbackState = feedback[index];
    const standardText = answer.answer.find((answer) => answer?.type === "text")
      ?.text;

    if (!standardText) {
      throw new Error("Text is missing from order answer");
    }

    return (
      <MathJaxWrap>
        <OakQuizResultItem
          key={standardText?.trim()}
          boldPrefixText={`${pupilAnswer + 1}`}
          standardText={standardText}
          feedbackState={feedbackState}
        />
      </MathJaxWrap>
    );
  });

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakSpan $font={"body-3-bold"}>Your answer:</OakSpan>
      <OakFlex $flexDirection={"column"} $gap={"space-between-m2"}>
        {resultItems}
      </OakFlex>
    </OakFlex>
  );
};
