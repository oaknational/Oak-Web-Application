import { StaticImageData } from "next/image";
import { CSSProperties, FC } from "react";

import AspectRatio, { AspectRatios } from "../../AspectRatio";
import OakImage, { OakImageProps } from "../../OakImage";

const DEFAULT_ASPECT_RATIO: AspectRatios = ["3:2", "16:9"];

export type CardImageProps = {
  imageSrc: string | StaticImageData;
  alt: string;
  position?: CSSProperties["objectPosition"];
  aspectRatio?: AspectRatios;
  priority?: boolean;
  ariaHidden?: boolean;
} & Partial<OakImageProps>;

const CardImage: FC<CardImageProps> = ({
  imageSrc,
  alt,
  position = "center center",
  aspectRatio = DEFAULT_ASPECT_RATIO,
  priority,
  ariaHidden = false,
  ...imageProps
}) => {
  return (
    <AspectRatio ratio={aspectRatio}>
      <OakImage
        aria-hidden={ariaHidden}
        $objectFit="contain"
        $objectPosition={position}
        src={imageSrc}
        alt={alt}
        priority={priority}
        fill
        {...imageProps}
      />
    </AspectRatio>
  );
};

export default CardImage;
