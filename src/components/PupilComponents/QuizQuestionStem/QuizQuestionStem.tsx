import React, { useEffect, useState } from "react";
import {
  OakCloudinaryImage,
  OakFlex,
  OakScaleImageButton,
  OakSpan,
} from "@oaknational/oak-components";

import {
  removeMarkdown,
  shortAnswerTitleFormatter,
} from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import {
  ImageItem,
  TextItem,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const QuizQuestionStem = ({
  questionStem,
  index,
  takeFullHeight,
}: {
  questionStem: (ImageItem | TextItem)[];
  index: number;
  takeFullHeight?: boolean;
}) => {
  const [scaled, setScaled] = useState(false);
  const displayNumber = `Q${index + 1}.`;
  useEffect(() => {
    setScaled(false);
  }, [questionStem]);

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
                <OakFlex>
                  <OakCloudinaryImage
                    cloudinaryId={stemItem.imageObject.publicId}
                    height={stemItem.imageObject.height}
                    width={stemItem.imageObject.width}
                    alt={"An image in a quiz"}
                    $minWidth={scaled ? "all-spacing-20" : "all-spacing-19"}
                    placeholder="oak"
                    sizes={getSizes(["100vw", 1200])}
                    $background={"white"}
                    role="presentation"
                  />
                  <OakFlex
                    $width={"all-spacing-7"}
                    $height={"all-spacing-7"}
                    $pointerEvents={"auto"}
                  >
                    <OakScaleImageButton
                      onImageScaleCallback={(e) => {
                        e.stopPropagation();
                        setScaled(!scaled);
                      }}
                      isExpanded={scaled}
                    />
                  </OakFlex>
                </OakFlex>
              )}
            </OakFlex>
          );
        }
      })}
    </OakFlex>
  );
};
