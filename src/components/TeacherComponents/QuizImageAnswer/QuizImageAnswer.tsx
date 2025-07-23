import { FC, useState } from "react";
import { VisuallyHidden } from "react-aria";
import { OakFlex, OakIcon } from "@oaknational/oak-components";

import {
  calcDims,
  removeMarkdown,
} from "../LessonOverviewQuizContainer/quizUtils";

import QuizOakImage from "@/components/TeacherComponents/QuizOakImage";
import { StemImageObject } from "@/node-lib/curriculum-api-2023/shared.schema";

type ImageProps = {
  src: StemImageObject["imageObject"];
  alt?: string;
  answerIsCorrect?: boolean;
};

const QuizImageAnswer: FC<ImageProps> = ({ src, alt, answerIsCorrect }) => {
  const [dims, setDims] = useState(calcDims(src.width, src.height));
  const containerBackgroundColor = answerIsCorrect ? "lemon50" : "white";
  return (
    <OakFlex
      $borderRadius={"border-radius-m2"}
      $height={"100%"}
      $pa={"inner-padding-xs"}
      $background={containerBackgroundColor}
    >
      {answerIsCorrect && (
        <VisuallyHidden>Correct Answer: {removeMarkdown(alt)}</VisuallyHidden>
      )}
      <OakFlex
        $background={containerBackgroundColor}
        $alignItems={"center"}
        $minWidth={"all-spacing-7"}
        aria-hidden
      >
        {answerIsCorrect && (
          <OakIcon
            data-testid={"answer-tick"}
            iconName={"tick"}
            $width={"all-spacing-6"}
            $height={"all-spacing-6"}
          />
        )}
      </OakFlex>
      <OakFlex
        $ba={"border-solid-s"}
        $background={"white"}
        $borderRadius={"border-radius-m2"}
      >
        <OakFlex
          $ph={"inner-padding-s"}
          $pv={"inner-padding-m"}
          $overflow={"hidden"}
          $position={"relative"}
          $minWidth={dims.width ? undefined : "all-spacing-14"}
          $minHeight={dims.height ? undefined : "all-spacing-14"}
          $justifyContent={"center"}
          $borderColor={"grey50"}
          $borderRadius={"border-radius-m2"}
        >
          <QuizOakImage src={src} dims={dims} setDims={setDims} alt={alt} />
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
};

export default QuizImageAnswer;
