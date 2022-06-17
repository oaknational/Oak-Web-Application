import { FC } from "react";

import P from "../../Typography/P";
import Card from "../Card";
import { OakColorName } from "../../../styles/theme";
import ButtonAsLink, { ButtonAsLinkProps } from "../../Button/ButtonAsLink";
import Flex from "../../Flex";
import CardImage, { CardImageProps } from "../CardComponents/CardImage";
import CardTitle, { CardTitleProps } from "../CardComponents/CardTitle";

export type CardImageIconButtonProps = {
  text: string;
  background?: OakColorName;
};

const CardImageIconButton: FC<
  CardImageIconButtonProps & CardTitleProps & ButtonAsLinkProps & CardImageProps
> = ({
  imageSrc,
  title,
  textCenter = false,
  text,
  icon,
  iconPosition = "leading",
  iconSize,
  href,
  label,
  background,
  tag,
}) => {
  return (
    <Card background={background} pa={0}>
      {imageSrc && <CardImage imageSrc={imageSrc} alt={title} />}
      <Flex ma={24} pt={!imageSrc ? 24 : 0} flexDirection={"column"}>
        <CardTitle
          icon={icon}
          iconPosition={iconPosition}
          iconSize={iconSize}
          title={title}
          textCenter={textCenter}
          tag={tag}
        />
        <P
          fontSize={16}
          textAlign={textCenter ? "center" : "start"}
          mb={24}
          color={"grey6"}
        >
          {text}
        </P>

        <Flex justifyContent="center">
          <ButtonAsLink label={label} href={href} mb={24} fullWidth />
        </Flex>
      </Flex>
    </Card>
  );
};

export default CardImageIconButton;
