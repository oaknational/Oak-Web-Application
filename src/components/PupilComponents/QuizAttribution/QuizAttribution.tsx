import { OakP, OakSpan } from "@oaknational/oak-components";
import { isNull, negate } from "lodash";

import { isImage } from "../QuizUtils/stemUtils";

import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

type QuizAttributionProps = {
  questionData: NonNullable<QuizQuestion> | NonNullable<QuizQuestion>[];
};

/**
 * Displays the attributions for the images in the question stem and answers
 */
export const QuizAttribution = ({ questionData }: QuizAttributionProps) => {
  const _questionData = Array.isArray(questionData)
    ? questionData
    : [questionData];

  const allAttributions = _questionData
    .map((questionData, qnum) => {
      const questionImages = questionData.questionStem?.filter(isImage) ?? [];
      const answerImages =
        questionData.answers?.["multiple-choice"]?.flatMap((choice) =>
          choice.answer.filter(isImage),
        ) ?? [];

      const questionAttribution = questionImages.map((stem, i) => {
        if (
          stem.imageObject.metadata &&
          "attribution" in stem.imageObject.metadata
        ) {
          const idx =
            (_questionData.length > 1 ? `${qnum + 1}.` : "") + (i + 1);
          const attribution = stem.imageObject.metadata.attribution;
          return attribution
            ? { idx, attribution: stem.imageObject.metadata.attribution }
            : null;
        }

        return null;
      });
      const answerAttributions = answerImages.map((stem, i) => {
        if (
          stem.imageObject.metadata &&
          "attribution" in stem.imageObject.metadata
        ) {
          const idx =
            (_questionData.length > 1 ? `${qnum + 1}.` : "") +
            (i + 1 + questionImages.length);
          const attribution = stem.imageObject.metadata.attribution;
          return attribution
            ? { idx, attribution: stem.imageObject.metadata.attribution }
            : null;
        }

        return null;
      });
      return [...questionAttribution, ...answerAttributions].filter(
        negate(isNull),
      );
    })
    .flat();

  if (allAttributions.length === 0) {
    return null;
  }

  return (
    <OakP $color="text-subdued" $font="body-3" data-testid="quiz-attribution">
      {allAttributions
        .flatMap((attribution) => [
          <OakSpan key={attribution?.idx}>
            {allAttributions.length > 1 && <strong>{attribution?.idx} </strong>}
            {attribution?.attribution}
          </OakSpan>,
          ", ",
        ])
        .slice(0, -1)}
    </OakP>
  );
};
