import { OakP } from "@oaknational/oak-components";
import { isNull, negate } from "lodash";

import { isImage } from "../QuizUtils/stemUtils";

import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

type QuizAttributionProps = {
  questionData: NonNullable<QuizQuestion>;
};

/**
 * Displays the attributions for the images in the question stem and answers
 */
export const QuizAttribution = ({ questionData }: QuizAttributionProps) => {
  const questionImages = questionData.questionStem?.filter(isImage);
  const answerImages =
    questionData.answers?.["multiple-choice"]?.flatMap((choice) =>
      choice.answer.filter(isImage),
    ) ?? [];
  const questionAttribution = questionImages.map((stem) => {
    if ("attribution" in stem.imageObject.metadata) {
      return stem.imageObject.metadata.attribution ?? null;
    }

    return null;
  });
  const answerAttributions = answerImages.map((stem, i) => {
    if ("attribution" in stem.imageObject.metadata) {
      return (
        <span key={i}>
          <strong>{i + 1}</strong> {stem.imageObject.metadata.attribution}
        </span>
      );
    }

    return null;
  });
  const allAttributions = [
    ...questionAttribution,
    ...answerAttributions,
  ].filter(negate(isNull));

  if (allAttributions.length === 0) {
    return null;
  }

  return (
    <OakP $color="text-subdued" $font="body-3" data-testid="quiz-attribution">
      {allAttributions
        .flatMap((attribution) => [attribution, ", "])
        .slice(0, -1)}
    </OakP>
  );
};
