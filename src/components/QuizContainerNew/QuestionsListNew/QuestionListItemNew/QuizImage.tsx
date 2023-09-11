import { FC, useState } from "react";

import { StemImageObject } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import Flex from "@/components/Flex";
import OakImage from "@/components/OakImage";

type ImageProps = { src: StemImageObject["image_object"]; alt?: string };

const QuizImage: FC<ImageProps> = ({ src, alt }) => {
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
