import React, { useEffect, useState } from "react";
import {
  OakCloudinaryImage,
  OakFlex,
  OakScaleImageButton,
  OakBox,
} from "@oaknational/oak-components";

import { CodeRenderWrapper } from "../CodeRendererWrapper/CodeRendererWrapper";

import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import {
  ImageItem,
  TextItem,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { Stem } from "@/components/SharedComponents/Stem";

export interface QuizQuestionStemProps {
  questionStem: (ImageItem | TextItem)[];
  index: number;
  takeFullHeight?: boolean;
  questionUid: string;
}

export const QuizQuestionStem = ({
  questionStem,
  index,
  takeFullHeight,
  questionUid,
}: QuizQuestionStemProps) => {
  const [scaled, setScaled] = useState(false);
  const displayNumber = `Q${index + 1}.`;
  useEffect(() => {
    setScaled(false);
  }, [questionStem]);

  return (
    <CodeRenderWrapper>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-16"}
        $color={"text-primary"}
        $height={takeFullHeight ? "100%" : "auto"}
        $justifyContent={["center", "flex-start"]}
      >
        <OakFlex
          key="stem-header"
          $mt={
            takeFullHeight
              ? ["spacing-0", "spacing-56", "spacing-72"]
              : "spacing-0"
          }
        >
          {questionStem[0]?.type === "text" && (
            <OakBox
              key={`q-${displayNumber}-stem-element-0`}
              $font={["heading-6", "heading-4", "heading-4"]}
              $width={"100%"}
              id={`${questionUid}-legend`}
            >
              <Stem stem={questionStem[0]} />
            </OakBox>
          )}
        </OakFlex>

        {questionStem.map((stemItem, i) => {
          if (stemItem.type === "text" && i > 0) {
            return (
              <OakBox
                key={`q-${displayNumber}-stem-element-${i}`}
                $font={["body-2-bold", "body-1-bold"]}
                $width={"100%"}
              >
                <Stem stem={stemItem} />
              </OakBox>
            );
          } else if (stemItem.type === "image") {
            return (
              <OakFlex
                $pv={"spacing-24"}
                key={`q-${displayNumber}-stem-element-${i}`}
              >
                {stemItem.imageObject.publicId && (
                  <OakFlex>
                    <OakCloudinaryImage
                      cloudinaryId={stemItem.imageObject.publicId}
                      height={stemItem.imageObject.height}
                      width={stemItem.imageObject.width}
                      alt={"An image in a quiz"}
                      $minWidth={scaled ? "spacing-360" : "spacing-240"}
                      placeholder="oak"
                      sizes={getSizes(["100vw", 1200])}
                      $background={"white"}
                      role="presentation"
                    />
                    <OakFlex
                      $width={"spacing-32"}
                      $height={"spacing-32"}
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
    </CodeRenderWrapper>
  );
};
