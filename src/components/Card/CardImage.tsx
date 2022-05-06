import { FC } from "react";
import Image, { StaticImageData } from "next/image";
// import imageUrl from "../../../public/Image.png";

import styles from "./CardImage.module.css";

export type ImageUrlType = string | StaticImageData;

interface CardImageProps {
  imageUrl: ImageUrlType;
}

const CardImage: FC<CardImageProps> = ({ imageUrl }) => {
  return (
    <div className={styles.imageWrapper}>
      <Image
        className={styles.image}
        layout={"responsive"}
        src={imageUrl}
      ></Image>
    </div>
  );
};

export default CardImage;
