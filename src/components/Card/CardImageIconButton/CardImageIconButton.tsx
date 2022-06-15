import { FC } from "react";

import P from "../../Typography/P";
import Card from "../Card";
import { OakColorName } from "../../../styles/theme";
import ButtonAsLink from "../../Button/ButtonAsLink";
import Flex from "../../Flex";

import CardTitle, { CardTitleProps } from "./CardTitle";
import CardImage, { CardImageProps } from "./CardImage";
import { CardButtonProps } from "./CardButton";

export type CardImageIconButtonProps = {
  text: string;
  background?: OakColorName;
};

const CardImageIconButton: FC<
  CardImageIconButtonProps & CardTitleProps & CardButtonProps & CardImageProps
> = ({
  imageSrc,
  title,
  textCenter = false,
  text,
  icon,
  iconPosition = "leading",
  buttonHref,
  buttonLabel,
  background = "grey1",
  tag,
}) => {
  return (
    <Card background={background} pa={0}>
      {imageSrc && <CardImage imageSrc={imageSrc} alt={title} />}
      <CardTitle
        icon={icon}
        iconPosition={iconPosition}
        title={title}
        textCenter={textCenter}
        tag={tag}
      />
      <P
        fontSize={16}
        textAlign={textCenter ? "center" : "start"}
        mb={24}
        ml={24}
        mr={24}
        color={"grey6"}
      >
        {text}
      </P>
      <Flex ph={24} justifyContent="center">
        <ButtonAsLink label={buttonLabel} href={buttonHref} mb={24} fullWidth />
      </Flex>
    </Card>
  );
};

export default CardImageIconButton;
