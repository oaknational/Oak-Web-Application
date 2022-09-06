import { FC } from "react";

import { OakColorName } from "../../styles/theme";
import Icon, { IconName } from "../Icon";
import { Heading, HeadingTag } from "../Typography";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";

import Card from "./Card";
import CardLink, { CardLinkProps } from "./CardLink";

type CardLinkIconProps = {
  title: string;
  titleTag: HeadingTag;
  icon?: IconName;
  background?: OakColorName;
  href: string;
  cardLinkProps?: Omit<CardLinkProps, "href" | "children">;
};
const CardLinkIcon: FC<CardLinkIconProps> = ({
  title,
  titleTag,
  icon = "ArrowRight",
  background,
  href,
  cardLinkProps,
}) => {
  return (
    <Card
      $flexDirection={"row"}
      $alignItems="center"
      $background={background}
      $ph={16}
      $pv={[24, 32]}
      $mb={[16, 0]}
      $borderRadius={0}
    >
      <BoxBorders />
      <Heading $fontSize={[20, 24]} tag={titleTag} $color={"black"}>
        <CardLink href={href} {...cardLinkProps}>
          {title}
        </CardLink>
      </Heading>

      <Icon name={icon} size={[32, 48]} $ml="auto" />
    </Card>
  );
};

export default CardLinkIcon;
