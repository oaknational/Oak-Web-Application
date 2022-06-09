import { FC } from "react";
import styled from "styled-components";

export type CardImageProps = {
  src: string;
  alt: string;
};

const CardImageWrap = styled.div`
  border-radius: 8px 8px 0 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
`;

const CardImage: FC<CardImageProps> = ({ src, alt }) => {
  return (
    <CardImageWrap>
      <StyledImage src={src} alt={alt} />
    </CardImageWrap>
  );
};

export default CardImage;
