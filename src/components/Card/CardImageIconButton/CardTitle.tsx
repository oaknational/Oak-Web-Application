import { FC } from "react";

import Flex from "../../Flex";
import Icon, { IconName } from "../../Icon";
import Heading, { HeadingTag } from "../../Typography/Heading";

const getIconFlexPosition = (iconPosition: CardTitleProps["iconPosition"]) => {
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

export type CardTitleProps = {
  title: string;
  tag: HeadingTag;
  icon?: IconName;
  iconPosition?: "leading" | "trailing" | "aboveTitle";
  textCenter?: boolean;
};

const CardTitle: FC<CardTitleProps> = ({
  title,
  textCenter,
  icon,
  iconPosition,
  tag,
}) => {
  return (
    <Flex
      flexDirection={getIconFlexPosition(iconPosition)}
      justifyContent={textCenter ? "center" : "start"}
      alignItems="center"
      pa={24}
    >
      {icon && (
        <Icon
          name={icon}
          size={iconPosition === "aboveTitle" ? 64 : 32}
          mb={iconPosition === "aboveTitle" ? 24 : 0}
        />
      )}
      <Heading
        ml={iconPosition === (icon && "leading") ? 8 : 0}
        mr={iconPosition === (icon && "trailing") ? 8 : 0}
        fontSize={24}
        tag={tag}
        color={"grey8"}
      >
        {title}
      </Heading>
    </Flex>
  );
};

export default CardTitle;
