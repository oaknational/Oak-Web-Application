import { FC, useState } from "react";
import { VisuallyHidden } from "react-aria";

import { removeMarkdown } from "../../quizUtils";

import { StemImageObject } from "@/node-lib/curriculum-api-2023/shared.schema";
import Flex from "@/components/Flex";
import OakImage from "@/components/OakImage";
import Icon from "@/components/Icon";

type ImageProps = {
  src: StemImageObject["image_object"];
  alt?: string;
  answerIsCorrect?: boolean;
};

const QuizImage: FC<ImageProps> = ({ src, alt, answerIsCorrect }) => {
  const constrainHeight = (h?: number) =>
    h ? Math.max(Math.min(200, h), 96) : undefined;

  const calcDims = (w?: number, h?: number) => {
    const constrainedHeight = constrainHeight(h);
    return w && h && constrainedHeight
      ? {
          width: Math.round((w / h) * constrainedHeight),
          height: constrainedHeight,
        }
      : { width: undefined, height: undefined };
  };

  const [dims, setDims] = useState(calcDims(src.width, src.height));
  const containerBackgroundColor = answerIsCorrect ? "lemon50" : "white";
  return (
    <Flex
      $borderRadius={8}
      $height={"100%"}
      $pa={8}
      $background={containerBackgroundColor}
    >
      <Flex
        $background={containerBackgroundColor}
        $alignItems={"center"}
        $minWidth={32}
        aria-hidden
      >
        {answerIsCorrect && <Icon data-testid={"answer-tick"} name={"tick"} />}
        <VisuallyHidden>Correct Answer: {removeMarkdown(alt)}</VisuallyHidden>
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
          {dims.width && dims.height ? (
            <OakImage
              $objectPosition={["center", "left"]}
              width={dims.width}
              height={dims.height}
              src={src.secure_url}
              alt={alt ?? ""}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <OakImage
              $objectPosition={["center", "left"]}
              fill
              src={src.secure_url}
              alt={alt ?? ""}
              style={{ objectFit: "contain" }}
              onLoad={(e) => {
                setDims(
                  calcDims(
                    e.currentTarget.naturalWidth,
                    e.currentTarget.naturalHeight,
                  ),
                );
              }}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default QuizImage;
