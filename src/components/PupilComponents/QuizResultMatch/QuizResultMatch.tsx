import {
  OakFlex,
  OakQuizResultItem,
  OakSpan,
} from "@oaknational/oak-components";

import { MatchAnswer } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import {
  PupilAnswerMatch,
  QuestionFeedbackType,
} from "@/components/PupilComponents/QuizUtils/questionTypes";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

export type QuizResultMatchProps = {
  answers: MatchAnswer[];
  feedback: QuestionFeedbackType[];
  pupilAnswers: PupilAnswerMatch;
};

export const QuizResultMatch = ({
  answers,
  feedback,
  pupilAnswers,
}: QuizResultMatchProps) => {
  const resultItems = pupilAnswers.map((pupilAnswer, index) => {
    const answer = answers[index];

    if (!answer) {
      throw new Error(`Answer not found for index ${index}`);
    }

    const feedbackState = feedback[index];

    if (!answer?.correctChoice?.[0]) {
      throw new Error(`Answer not found for index ${pupilAnswer}`);
    }
    const prefix = answer?.correctChoice[0].text;
    const standardText = pupilAnswer;

    if (!standardText) {
      throw new Error("Text is missing from order answer");
    }

    return (
      <MathJaxWrap>
        <OakQuizResultItem
          key={standardText?.trim()}
          standardText={standardText}
          boldPrefixText={prefix}
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
