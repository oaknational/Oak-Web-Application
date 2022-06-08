import { FC } from "react";
import { StaticImageData } from "next/image";
import styled from "styled-components";

import { Text } from "../../Typography/Typography";
import Card from "../Card";

import CardTitle, { CardTitleProps } from "./CardTitle";
import CardImage from "./CardImage";
import CardButton from "./CardButton";

export type CardImageIconButtonProps = {
  text: string;
  imageUrl?: string;
  src?: string | StaticImageData;
  buttonHref: string;
  buttonLabel: string;
};

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: thin solid grey;
`;

const CardImageIconButton: FC<CardImageIconButtonProps & CardTitleProps> = ({
  imageUrl,
  title,
  textCenter = false,
  text,
  icon,
  iconPosition = "leading",
  buttonHref,
  buttonLabel,
}) => {
  return (
    <CardContainer>
      {imageUrl && <CardImage src={imageUrl} />}
      <Card>
        <CardTitle
          icon={icon}
          iconPosition={iconPosition}
          title={title}
          textCenter={textCenter}
        />
        <Text
          size={2}
          color="grey6"
          textAlign={textCenter ? "center" : "start"}
          mb={24}
        >
          {text}
        </Text>

        <CardButton mb={12} label={buttonLabel} href={buttonHref} />
      </Card>
    </CardContainer>
  );
};

export default CardImageIconButton;
