import { FC } from "react";
import { CSSProperties } from "styled-components";
import {
  OakFlex,
  OakIcon,
  OakAllSpacingToken,
  OakIconName,
} from "@oaknational/oak-components";

import { ResponsiveValues } from "@/styles/utils/responsive";
import { FontVariant } from "@/styles/utils/typography";
import Heading, {
  HeadingTag,
} from "@/components/SharedComponents/Typography/Heading.deprecated";

export const getIconFlexPosition = (
  $iconPosition: IconPosition | null,
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
  icon?: OakIconName;
  $iconPosition?: ResponsiveValues<IconPosition>;
  iconSize?: OakAllSpacingToken;
  $font?: ResponsiveValues<FontVariant>;
};

const CardTitle: FC<CardTitleProps> = ({
  icon,
  $iconPosition = "leading",
  iconSize = "spacing-32",
  tag,
  children,
  $font = "heading-5",
}) => {
  const iconPositionArray: (IconPosition | null)[] = Array.isArray(
    $iconPosition,
  )
    ? $iconPosition
    : [$iconPosition];

  return (
    <OakFlex
      $flexDirection={iconPositionArray.map(getIconFlexPosition)}
      $alignItems={iconPositionArray.map((pos) =>
        pos === "aboveTitle" ? "flex-start" : "center",
      )}
      $mb="spacing-24"
    >
      {icon && (
        <OakIcon
          iconName={icon}
          $width={iconPositionArray.map((pos) =>
            pos === "aboveTitle" ? "spacing-64" : iconSize,
          )}
          $height={iconPositionArray.map((pos) =>
            pos === "aboveTitle" ? "spacing-64" : iconSize,
          )}
          $mb={iconPositionArray.map((pos) =>
            pos === "aboveTitle" ? "spacing-12" : "spacing-0",
          )}
          $mr={iconPositionArray.map((pos) => {
            switch (pos) {
              case "leading":
                return "spacing-12";
              case "trailing":
                return "spacing-0";
              case "aboveTitle":
                return "auto";
              default:
                return null;
            }
          })}
          $ml={iconPositionArray.map((pos) => {
            switch (pos) {
              case "leading":
                return "spacing-0";
              case "trailing":
                return "spacing-8";
              case "aboveTitle":
                return "auto";
              default:
                return null;
            }
          })}
          $pa={"spacing-0"}
        />
      )}
      <Heading $font={$font} tag={tag}>
        {children}
      </Heading>
    </OakFlex>
  );
};

export default CardTitle;
