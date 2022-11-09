import { FC } from "react";
import { CSSProperties } from "styled-components";

import { PixelSpacing } from "../../../styles/theme";
import { ResponsiveValues } from "../../../styles/utils/responsive";
import { FontVariant } from "../../../styles/utils/typography";
import Flex from "../../Flex";
import Icon, { IconName } from "../../Icon";
import Heading, { HeadingTag } from "../../Typography/Heading";

export const getIconFlexPosition = (
  $iconPosition: IconPosition | null
): CSSProperties["flexDirection"] => {
  switch ($iconPosition) {
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
  children?: React.ReactNode;
  tag: HeadingTag;
  icon?: IconName;
  $iconPosition?: ResponsiveValues<IconPosition>;
  iconSize?: PixelSpacing;
  $font?: ResponsiveValues<FontVariant>;
};

const CardTitle: FC<CardTitleProps> = ({
  icon,
  $iconPosition = "leading",
  iconSize = 32,
  tag,
  children,
  $font = "heading-5",
}) => {
  const iconPositionArray: (IconPosition | null)[] = Array.isArray(
    $iconPosition
  )
    ? $iconPosition
    : [$iconPosition];

  return (
    <Flex
      $flexDirection={iconPositionArray.map(getIconFlexPosition)}
      $alignItems={iconPositionArray.map((pos) =>
        pos === "aboveTitle" ? "flex-start" : "center"
      )}
      $mb={24}
    >
      {icon && (
        <Icon
          name={icon}
          size={iconPositionArray.map((pos) =>
            pos === "aboveTitle" ? 64 : iconSize
          )}
          $mb={iconPositionArray.map((pos) => (pos === "aboveTitle" ? 12 : 0))}
          $mr={iconPositionArray.map((pos) => {
            switch (pos) {
              case "leading":
                return 12;
              case "trailing":
                return 0;
              case "aboveTitle":
                return "auto";
              default:
                return null;
            }
          })}
          $ml={iconPositionArray.map((pos) => {
            switch (pos) {
              case "leading":
                return 0;
              case "trailing":
                return 8;
              case "aboveTitle":
                return "auto";
              default:
                return null;
            }
          })}
          $pa={0}
        />
      )}
      <Heading $font={$font} tag={tag}>
        {children}
      </Heading>
    </Flex>
  );
};

export default CardTitle;
