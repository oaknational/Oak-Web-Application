import { FC, useState } from "react";
import { VisuallyHidden } from "react-aria";

import { calcDims, removeMarkdown } from "../../quizUtils";

import QuizOakImage from "./QuizOakImage";

import { StemImageObject } from "@/node-lib/curriculum-api-2023/shared.schema";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";

type ImageProps = {
  src: StemImageObject["image_object"];
  alt?: string;
  answerIsCorrect?: boolean;
};

const QuizImageAnswer: FC<ImageProps> = ({ src, alt, answerIsCorrect }) => {
  const [dims, setDims] = useState(calcDims(src.width, src.height));
  const containerBackgroundColor = answerIsCorrect ? "lemon50" : "white";
  return (
    <Flex
      $borderRadius={8}
      $height={"100%"}
      $pa={8}
      $background={containerBackgroundColor}
    >
      {answerIsCorrect && (
        <VisuallyHidden>Correct Answer: {removeMarkdown(alt)}</VisuallyHidden>
      )}
      <Flex
        $background={containerBackgroundColor}
        $alignItems={"center"}
        $minWidth={32}
        aria-hidden
      >
        {answerIsCorrect && <Icon data-testid={"answer-tick"} name={"tick"} />}
      </Flex>
      <Flex $ba={1} $background={"white"} $borderRadius={8}>
        <Flex
          $ph={10}
          $pv={16}
          $overflow={"hidden"}
          $position={"relative"}
          $minWidth={dims.width ? undefined : 96}
          $minHeight={dims.height ? undefined : 96}
          $justifyContent={"center"}
          $borderColor={"grey6"}
          $borderRadius={8}
        >
          <QuizOakImage src={src} dims={dims} setDims={setDims} alt={alt} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default QuizImageAnswer;
