import { FC, useState } from "react";

import { calcDims } from "../../quizUtils";

import { StemImageObject } from "@/node-lib/curriculum-api-2023/shared.schema";
import Flex from "@/components/Flex";
import OakImage from "@/components/OakImage";

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
  );
};

export default QuizImage;
