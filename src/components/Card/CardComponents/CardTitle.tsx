import { FC } from "react";

import { PixelSpacing } from "../../../styles/theme";
import Flex from "../../Flex";
import Icon, { IconName } from "../../Icon";
import Heading, { HeadingTag } from "../../Typography/Heading";

export const getIconFlexPosition = (
  iconPosition: CardTitleProps["iconPosition"]
) => {
  switch (iconPosition) {
    case "leading":
      return "row";
    case "trailing":
      return "row-reverse";
    case "aboveTitle":
      return "column";
    default:
      return undefined;
  }
};

type IconPosition = "leading" | "trailing" | "aboveTitle";

export type CardTitleProps = {
  tag: HeadingTag;
  icon?: IconName;
  iconPosition?: IconPosition;
  iconSize?: PixelSpacing;
  textCenter?: boolean;
};

const CardTitle: FC<CardTitleProps> = ({
  textCenter,
  icon,
  iconPosition = "leading",
  iconSize = 32,
  tag,
  children,
}) => {
  return (
    <Flex
      $flexDirection={getIconFlexPosition(iconPosition)}
      $justifyContent={textCenter ? "center" : "start"}
      $alignItems="center"
      $mb={24}
    >
      {icon && (
        <Icon
          name={icon}
          size={iconPosition === "aboveTitle" ? 64 : iconSize}
          $mb={iconPosition === "aboveTitle" ? 12 : 0}
          $mr={iconPosition === (icon && "leading") ? 8 : 0}
          $ml={iconPosition === (icon && "trailing") ? 8 : 0}
        />
      )}
      <Heading $fontSize={24} tag={tag}>
        {children}
      </Heading>
    </Flex>
  );
};

export default CardTitle;
