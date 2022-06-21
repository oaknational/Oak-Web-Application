import { FC } from "react";

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
  title: string;
  tag: HeadingTag;
  icon?: IconName;
  iconPosition?: IconPosition;
  iconSize?: number;
  textCenter?: boolean;
};

const CardTitle: FC<CardTitleProps> = ({
  title,
  textCenter,
  icon,
  iconPosition,
  iconSize,
  tag,
}) => {
  return (
    <Flex
      flexDirection={getIconFlexPosition(iconPosition)}
      justifyContent={textCenter ? "center" : "start"}
      alignItems="center"
      mb={24}
    >
      {icon && (
        <Icon
          name={icon}
          size={
            !iconSize ? (iconPosition === "aboveTitle" ? 64 : 32) : iconSize
          }
          mb={iconPosition === "aboveTitle" ? 12 : 0}
          color={"grey8"}
          mr={iconPosition === (icon && "leading") ? 8 : 0}
          ml={iconPosition === (icon && "trailing") ? 8 : 0}
        />
      )}
      <Heading fontSize={24} tag={tag} color={"grey8"}>
        {title}
      </Heading>
    </Flex>
  );
};

export default CardTitle;
