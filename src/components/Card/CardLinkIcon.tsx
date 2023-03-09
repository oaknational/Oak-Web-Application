import { FC } from "react";

import { OakColorName } from "../../styles/theme";
import Icon, { IconName } from "../Icon";
import { Heading, HeadingTag } from "../Typography";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";

import Card from "./Card";
import CardLink, { CardLinkFocusUnderline, CardLinkProps } from "./CardLink";

type RemoveField<Type, Key extends keyof Type> = {
  [Property in keyof Type as Exclude<Property, Key>]: Type[Property];
};

type CardLinkIconProps = RemoveField<CardLinkProps, "children"> & {
  title: string;
  titleTag: HeadingTag;
  icon?: IconName;
  background?: OakColorName;
};
const CardLinkIcon: FC<CardLinkIconProps> = ({
  title,
  titleTag,
  icon = "arrow-right",
  background,
  ...cardLinkProps
}) => {
  return (
    <Card
      $flexDirection={"row"}
      $alignItems="center"
      $background={background}
      $ph={[16, 24]}
      $pv={[24, 32]}
      $mb={[16, 0]}
      $borderRadius={0}
    >
      <BoxBorders gapPosition="rightTop" />
      <Heading $font={["heading-6", "heading-5"]} tag={titleTag}>
        <CardLink
          {...cardLinkProps}
          $hoverStyles={["underline-link-text", "drop-shadow"]}
          $hideDefaultFocus
        >
          {title}
        </CardLink>
        <CardLinkFocusUnderline />
      </Heading>
      <Icon name={icon} size={[32, 48]} $ml="auto" />
    </Card>
  );
};

export default CardLinkIcon;
