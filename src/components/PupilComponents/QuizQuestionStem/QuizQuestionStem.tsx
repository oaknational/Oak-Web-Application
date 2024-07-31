import {
  OakCloudinaryImage,
  OakFlex,
  OakSpan,
} from "@oaknational/oak-components";

import { QuizQuestionStemProps } from "../QuizResultQuestionStem/QuizResultQuestionStem";

import {
  removeMarkdown,
  shortAnswerTitleFormatter,
} from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";

export const QuizQuestionStem = (props: QuizQuestionStemProps) => {
  const { questionStem, index, takeFullHeight } = props;
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
              {stemItem.imageObject.publicId && (
                <OakCloudinaryImage
                  cloudinaryId={stemItem.imageObject.publicId}
                  height={stemItem.imageObject.height}
                  width={stemItem.imageObject.width}
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
