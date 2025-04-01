import { FC } from "react";
import {
  OakHeading,
  OakHeadingTag,
  OakIcon,
  OakIconName,
} from "@oaknational/oak-components";

import Card from "./Card";
import CardLink, { CardLinkFocusUnderline, CardLinkProps } from "./CardLink";

import { OakColorName } from "@/styles/theme";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";

type RemoveField<Type, Key extends keyof Type> = {
  [Property in keyof Type as Exclude<Property, Key>]: Type[Property];
};

type CardLinkIconProps = RemoveField<CardLinkProps, "children"> & {
  title: string;
  titleTag: OakHeadingTag;
  icon?: OakIconName;
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
      <OakHeading $font={["heading-6", "heading-5"]} tag={titleTag}>
        <CardLink
          {...cardLinkProps}
          $hoverStyles={["underline-link-text", "drop-shadow"]}
          $hideDefaultFocus
        >
          {title}
        </CardLink>
        <CardLinkFocusUnderline name="underline" />
      </OakHeading>
      <OakIcon
        iconName={icon}
        $width={["all-spacing-7", "all-spacing-9"]}
        $height={["all-spacing-7", "all-spacing-9"]}
        $ml="auto"
      />
    </Card>
  );
};

export default CardLinkIcon;
