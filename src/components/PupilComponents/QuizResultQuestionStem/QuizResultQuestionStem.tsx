import {
  OakCloudinaryImage,
  OakFlex,
  OakSpan,
} from "@oaknational/oak-components";

import { CodeRenderWrapper } from "../CodeRendererWrapper/CodeRendererWrapper";

import {
  ImageItem,
  TextItem,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import { Stem } from "@/components/SharedComponents/Stem";

export interface QuizQuestionStemProps {
  questionStem: (ImageItem | TextItem)[];
  displayIndex: number;
}

export const QuizResultQuestionStem = (props: QuizQuestionStemProps) => {
  const { questionStem, displayIndex } = props;

  const isHint = displayIndex === 999;
  const questionNumber = isHint ? "" : `Q${displayIndex}.`;

  return (
    <CodeRenderWrapper>
      <OakFlex
        $flexDirection={"column"}
        $gap={"space-between-m"}
        $color={"text-primary"}
        $justifyContent={["center", "flex-start"]}
      >
        <OakFlex key="stem-header">
          {questionStem[0]?.type === "text" && (
            <OakSpan
              key={`q-${displayIndex}-stem-element-0`}
              $font={"body-2-bold"}
            >
              {questionNumber} <Stem stem={questionStem[0]} />
            </OakSpan>
          )}
        </OakFlex>

        {questionStem.map((stemItem, i) => {
          if (stemItem.type === "text" && i > 0) {
            return (
              <OakSpan
                key={`q-${displayIndex}-stem-element-${i}`}
                $font={"body-2-bold"}
              >
                <Stem stem={stemItem} />
              </OakSpan>
            );
          } else if (stemItem.type === "image") {
            return (
              <OakFlex key={`q-${displayIndex}-stem-element-${i}`}>
                {stemItem.imageObject.publicId && (
                  <OakCloudinaryImage
                    cloudinaryId={stemItem.imageObject.publicId}
                    height={stemItem.imageObject.height}
                    width={stemItem.imageObject.width}
                    alt={"An image in a quiz"}
                    $minWidth={"all-spacing-19"}
                    placeholder="oak"
                    sizes={getSizes(["100vw", 1200])}
                    $background={"white"}
                    role="presentation"
                  />
                )}
              </OakFlex>
            );
          }
        })}
      </OakFlex>
    </CodeRenderWrapper>
  );
};
