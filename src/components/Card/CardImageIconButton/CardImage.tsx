import Image, { StaticImageData } from "next/image";
import { FC } from "react";
import styled from "styled-components";

export type CardImageProps = {
  src: string | StaticImageData;
};

const CardImageWrap = styled.div`
  border-radius: 8px 8px 0 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardImage: FC<CardImageProps> = ({ src }) => {
  return (
    <CardImageWrap>
      <Image
        src={src}
        width="100%"
        height="60%"
        layout="responsive"
        objectFit="cover"
      ></Image>
    </CardImageWrap>
  );
};

export default CardImage;
