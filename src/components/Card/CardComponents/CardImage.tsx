import { CSSProperties, FC } from "react";
import NextImage, { StaticImageData } from "next/image";

import AspectRatio, { AspectRatios } from "../../AspectRatio";

const DEFAULT_ASPECT_RATIO: AspectRatios = ["3:2", "16:9"];

export type CardImageProps = {
  imageSrc: string | StaticImageData;
  alt: string;
  position?: CSSProperties["objectPosition"];
  aspectRatio?: AspectRatios;
  priority?: boolean;
};

const CardImage: FC<CardImageProps> = ({
  imageSrc,
  alt,
  position = "center center",
  aspectRatio = DEFAULT_ASPECT_RATIO,
  priority,
}) => {
  return (
    <AspectRatio ratio={aspectRatio}>
      <NextImage
        layout="fill"
        objectFit="contain"
        objectPosition={position}
        src={imageSrc}
        alt={alt}
        priority={priority}
      />
    </AspectRatio>
  );
};

export default CardImage;
