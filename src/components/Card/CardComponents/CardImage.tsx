import { FC } from "react";
import NextImage, { StaticImageData } from "next/image";

import AspectRatio from "../../AspectRatio/AspectRatio";

export type CardImageProps = {
  imageSrc: string | StaticImageData;
  alt: string;
};

const CardImage: FC<CardImageProps> = ({ imageSrc, alt }) => {
  return (
    <AspectRatio ratio={["3:2", "16:9"]}>
      <NextImage
        layout="fill"
        objectFit="cover"
        objectPosition="center center"
        src={imageSrc}
        alt={alt}
      />
    </AspectRatio>
  );
};

export default CardImage;
