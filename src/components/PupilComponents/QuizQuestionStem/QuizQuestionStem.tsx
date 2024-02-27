import {
  OakCloudinaryImage,
  OakFlex,
  OakSpan,
} from "@oaknational/oak-components";

import {
  removeMarkdown,
  shortAnswerTitleFormatter,
} from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import {
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";

export const QuizQuestionStem = ({
  questionStem,
  index,
  takeFullHeight,
}: {
  questionStem: (StemImageObject | StemTextObject)[];
  index: number;
  takeFullHeight?: boolean;
}) => {
  const displayNumber = `Q${index + 1}.`;

  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={"space-between-s"}
      $color={"text-primary"}
      $height={takeFullHeight ? "100%" : "auto"}
      $justifyContent={["center", "flex-start"]}
    >
      <OakFlex
        key="stem-header"
        $mt={
          takeFullHeight
            ? ["space-between-none", "space-between-xl", "space-between-xxl"]
            : "space-between-none"
        }
      >
        {questionStem[0]?.type === "text" && (
          <OakSpan
            key={`q-${displayNumber}-stem-element-0`}
            $font={["heading-6", "heading-4", "heading-4"]}
          >
            {shortAnswerTitleFormatter(removeMarkdown(questionStem[0].text))}
          </OakSpan>
        )}
      </OakFlex>

      {questionStem.map((stemItem, i) => {
        if (stemItem.type === "text" && i > 0) {
          return (
            <OakSpan
              key={`q-${displayNumber}-stem-element-${i}`}
              $font={["body-2-bold", "body-1-bold"]}
            >
              {shortAnswerTitleFormatter(removeMarkdown(stemItem.text))}
            </OakSpan>
          );
        } else if (stemItem.type === "image") {
          return (
            <OakFlex
              $pv={"inner-padding-xl"}
              key={`q-${displayNumber}-stem-element-${i}`}
            >
              {stemItem.image_object.public_id && (
                <OakCloudinaryImage
                  cloudinaryId={stemItem.image_object.public_id}
                  height={stemItem.image_object.height}
                  width={stemItem.image_object.width}
                  alt={""}
                  $minWidth={"all-spacing-19"}
                  placeholder="oak"
                  sizes={getSizes(["100vw", 1200])}
                  $background={"white"}
                />
              )}
            </OakFlex>
          );
        }
      })}
    </OakFlex>
  );
};
