import { FC } from "react";

import { OakColorName } from "../../styles/theme";
import Icon, { IconName } from "../Icon";
import { Heading, HeadingTag } from "../Typography";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";

import Card from "./Card";
import CardLink from "./CardLink";

type CardLinkIconProps = {
  title: string;
  titleTag: HeadingTag;
  icon?: IconName;
  background?: OakColorName;
  href: string;
};
const CardLinkIcon: FC<CardLinkIconProps> = ({
  title,
  titleTag,
  icon = "ArrowRight",
  background,
  href,
}) => {
  return (
    <Card
      $flexDirection={"row"}
      $justifyContent={"space-between"}
      $alignItems="center"
      $background={background}
      $ph={16}
      $pv={[24, 40]}
      $mb={[16, 0]}
      $borderRadius={0}
    >
      <BoxBorders />
      <Heading $fontSize={[20, 24]} tag={titleTag} $color={"black"}>
        <CardLink href={href}>{title}</CardLink>
      </Heading>

      <Icon name={icon} size={32} />
    </Card>
  );
};

export default CardLinkIcon;
