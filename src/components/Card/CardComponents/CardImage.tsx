import { CSSProperties, FC } from "react";

import { IllustrationSlug } from "../../../image-data";
import AspectRatio, { AspectRatios } from "../../AspectRatio";
import { CMSImageProps } from "../../CMSImage/CMSImage";
import Illustration from "../../Illustration";

const DEFAULT_ASPECT_RATIO: AspectRatios = ["3:2", "16:9"];

export type CardImageProps = {
  illustration: IllustrationSlug;
  position?: CSSProperties["objectPosition"];
  aspectRatio?: AspectRatios;
  priority?: boolean;
  ariaHidden?: boolean;
} & Partial<CMSImageProps>;

const CardImage: FC<CardImageProps> = ({
  position = "center center",
  aspectRatio = DEFAULT_ASPECT_RATIO,
  priority,
  illustration,
  ...imageProps
}) => {
  return (
    <AspectRatio ratio={aspectRatio}>
      <Illustration
        slug={illustration}
        $objectFit="contain"
        $objectPosition={position}
        priority={priority}
        fill
        {...imageProps}
      />
    </AspectRatio>
  );
};

export default CardImage;
