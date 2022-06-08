import { FC } from "react";
import { StaticImageData } from "next/image";
import styled from "styled-components";

import { Text } from "../../Typography/Typography";
import Card from "../Card";
import ButtonAsLink from "../../Button/ButtonAsLink";

import CardTitle, { CardTitleProps } from "./CardTitle";
import CardImage from "./CardImage";

export type CardImageIconButtonProps = {
  text: string;
  imageUrl?: string | StaticImageData;
  src?: string | StaticImageData;
  buttonHref: string;
  buttonLabel: string;
};

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: solid black;
`;

// const CardImage = styled.img<Pick<CardImageIconButtonProps, "src">>`
//   /* stylelint-disable-line length-zero-no-unit */
//   border-radius: 8px 8px 0 0;
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `;

const CardButton = styled(ButtonAsLink)`
  width: 100%;
`;

const CardImageButton: FC<CardImageIconButtonProps & CardTitleProps> = ({
  imageUrl,
  title,
  textCenter = false,
  text,
  icon,
  iconPosition = "leading",
  buttonHref,
  buttonLabel,
}) => {
  console.log(textCenter);
  return (
    <CardContainer>
      {imageUrl && <CardImage src={imageUrl} />}

      <Card>
        <CardTitle
          icon={icon}
          iconPosition={iconPosition}
          title={title}
          textCenter
        />
        <Text
          size={2}
          color="grey6"
          textAlign={textCenter ? "center" : "start"}
          mb={24}
        >
          {text}
        </Text>

        <CardButton label={buttonLabel} href={buttonHref} />
      </Card>
    </CardContainer>
  );
};

export default CardImageButton;
