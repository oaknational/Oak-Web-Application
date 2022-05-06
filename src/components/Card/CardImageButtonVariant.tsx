import { FC } from "react";

import { IconName } from "../Icon/Icon";

import Card from "./Card";
import CardText, { CardIconPosition } from "./CardText";
import CardContainer from "./CardContainer";
import CardImage, { ImageUrlType } from "./CardImage";
import CardButton from "./CardButton";

type CardImageButtonProps = {
  title: string;
  titleAlignCenter?: boolean;
  text: string;
  textAlignCenter?: boolean;
  imageUrl?: ImageUrlType;
  icon?: IconName;
  iconPosition?: CardIconPosition;
  buttonHref: string;
  buttonLabel: string;
};

const CardImageButtonVariant: FC<CardImageButtonProps> = ({
  imageUrl,
  title,
  titleAlignCenter,
  text,
  textAlignCenter,
  icon,
  iconPosition,
  buttonHref,
  buttonLabel,
}) => {
  return (
    <CardContainer>
      {imageUrl && <CardImage imageUrl={imageUrl} />}
      <Card radius={false}>
        <CardText
          alignCenter={titleAlignCenter}
          icon={icon}
          iconPosition={iconPosition}
        >
          {title}
        </CardText>
        <CardText alignCenter={textAlignCenter} variant={"body3"}>
          {text}
        </CardText>
        <CardButton href={buttonHref} label={buttonLabel} />
      </Card>
    </CardContainer>
  );
};

export default CardImageButtonVariant;
