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
      $pa={"spacing-8"}
      $background={containerBackgroundColor}
    >
      {answerIsCorrect && (
        <VisuallyHidden>Correct Answer: {removeMarkdown(alt)}</VisuallyHidden>
      )}
      <OakFlex
        $background={containerBackgroundColor}
        $alignItems={"center"}
        $minWidth={"spacing-32"}
        aria-hidden
      >
        {answerIsCorrect && (
          <OakIcon
            data-testid={"answer-tick"}
            iconName={"tick"}
            $width={"spacing-24"}
            $height={"spacing-24"}
          />
        )}
      </OakFlex>
      <OakFlex
        $ba={"border-solid-s"}
        $background={"bg-primary"}
        $borderRadius={"border-radius-m2"}
      >
        <OakFlex
          $ph={"spacing-12"}
          $pv={"spacing-16"}
          $overflow={"hidden"}
          $position={"relative"}
          $minWidth={dims.width ? undefined : "spacing-92"}
          $minHeight={dims.height ? undefined : "spacing-92"}
          $justifyContent={"center"}
          $borderColor={"border-neutral"}
          $borderRadius={"border-radius-m2"}
        >
          <QuizOakImage src={src} dims={dims} setDims={setDims} alt={alt} />
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
};

export default QuizImageAnswer;
