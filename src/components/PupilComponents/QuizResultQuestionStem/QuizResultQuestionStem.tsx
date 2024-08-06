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
  ImageItem,
  TextItem,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

type QuizQuestionStemProps = {
  questionStem: (ImageItem | TextItem)[];
  index: number;
};

export const QuizResultQuestionStem = (props: QuizQuestionStemProps) => {
  const { questionStem, index } = props;

  const displayNumber = `Q${index + 1}.`;

  return (
    <MathJaxWrap>
      {" "}
      <OakFlex
        $flexDirection={"column"}
        $gap={"space-between-m"}
        $color={"text-primary"}
        $justifyContent={["center", "flex-start"]}
      >
        <OakFlex key="stem-header">
          {questionStem[0]?.type === "text" && (
            <OakSpan
              key={`q-${displayNumber}-stem-element-0`}
              $font={"body-2-bold"}
            >
              {`${displayNumber} ${shortAnswerTitleFormatter(
                removeMarkdown(questionStem[0].text),
              )}`}
            </OakSpan>
          )}
        </OakFlex>

        {questionStem.map((stemItem, i) => {
          if (stemItem.type === "text" && i > 0) {
            return (
              <OakSpan
                key={`q-${displayNumber}-stem-element-${i}`}
                $font={"body-2-bold"}
              >
                {shortAnswerTitleFormatter(removeMarkdown(stemItem.text))}
              </OakSpan>
            );
          } else if (stemItem.type === "image") {
            return (
              <OakFlex key={`q-${displayNumber}-stem-element-${i}`}>
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
    </MathJaxWrap>
  );
};
