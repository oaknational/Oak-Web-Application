import { FC, useState } from "react";

import { calcDims } from "../../quizUtils";

import QuizOakImage from "./QuizOakImage";

import { StemImageObject } from "@/node-lib/curriculum-api-2023/shared.schema";
import Flex from "@/components/Flex";

type ImageProps = { src: StemImageObject["image_object"]; alt?: string };

const QuizImage: FC<ImageProps> = ({ src, alt }) => {
  const [dims, setDims] = useState(calcDims(src.width, src.height));

  return (
    <Flex
      $overflow={"hidden"}
      $position={"relative"}
      $minWidth={dims.width ? undefined : 96}
      $minHeight={dims.height ? undefined : 96}
      $justifyContent={"center"}
    >
      <QuizOakImage src={src} dims={dims} setDims={setDims} alt={alt} />
    </Flex>
  );
};

export default QuizImage;
