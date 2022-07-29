import { CSSProperties, FC } from "react";
import NextImage, { StaticImageData } from "next/image";

import AspectRatio from "../../AspectRatio/AspectRatio";

export type CardImageProps = {
  imageSrc: string | StaticImageData;
  alt: string;
  position?: CSSProperties["objectPosition"];
};

const CardImage: FC<CardImageProps> = ({
  imageSrc,
  alt,
  position = "center center",
}) => {
  return (
    <AspectRatio ratio={["3:2", "16:9"]}>
      <NextImage
        layout="fill"
        objectFit="contain"
        objectPosition={position}
        src={imageSrc}
        alt={alt}
      />
    </AspectRatio>
  );
};

export default CardImage;
