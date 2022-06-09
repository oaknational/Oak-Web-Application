import { FC } from "react";

import { Text } from "../../Typography/Typography";
import Card from "../Card";
import { OakColorName } from "../../../styles/theme";

import CardTitle, { CardTitleProps } from "./CardTitle";
import CardImage, { CardImageProps } from "./CardImage";
import CardButton, { CardButtonProps } from "./CardButton";


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
}) => {
  return (
    <Card background={background} pa={0}>
      {imageSrc && <CardImage imageSrc={imageSrc} alt={title} />}
      <CardTitle
        icon={icon}
        iconPosition={iconPosition}
        title={title}
        textCenter={textCenter}
      />
      <Text
        size={2}
        textAlign={textCenter ? "center" : "start"}
        mb={24}
        ml={24}
        mr={24}
      >
        {text}
      </Text>

      <CardButton buttonLabel={buttonLabel} buttonHref={buttonHref} />
    </Card>
  );
};

export default CardImageIconButton;
