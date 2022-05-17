import { FC } from "react";
import Image, { StaticImageData } from "next/image";

import styles from "./CardImage.module.css";

export type ImageUrlType = string | StaticImageData;

interface CardImageProps {
  imageUrl: ImageUrlType;
  width?: number;
  height?: number;
}

const CardImage: FC<CardImageProps> = ({ imageUrl, width, height }) => {
  return (
    <div className={styles.imageWrapper}>
      <Image
        // className={styles.image}
        layout={"responsive"}
        src={imageUrl}
        width={width}
        height={height}
      ></Image>
    </div>
  );
};

export default CardImage;
