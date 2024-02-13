import { OakP } from "@oaknational/oak-components";

import { isImage } from "../QuizUtils/stemUtils";

import { LessonOverviewQuizQuestion } from "@/node-lib/curriculum-api-2023/shared.schema";

type QuizAttributionProps = {
  questionStem: LessonOverviewQuizQuestion["questionStem"];
};

/**
 * Displays the attribution for the image in the question stem if present
 */
export const QuizAttribution = ({ questionStem }: QuizAttributionProps) => {
  return (
    <>
      {questionStem.filter(isImage).map((stem) => {
        if (
          "attribution" in stem.image_object.metadata &&
          stem.image_object.metadata.attribution
        ) {
          return (
            <OakP
              key={stem.image_object.secure_url}
              $color="text-subdued"
              $font="body-3"
            >
              {stem.image_object.metadata.attribution}
            </OakP>
          );
        }

        return null;
      })}
    </>
  );
};
