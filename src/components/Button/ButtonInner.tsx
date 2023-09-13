import { FC } from "react";
import styled, { useTheme } from "styled-components";

import Flex from "../Flex";

import ButtonLabel from "./ButtonLabel";
import {
  ButtonBackground,
  buttonIconSizeMap,
  ButtonSize,
  ButtonVariant,
  getButtonIconBackground,
  IconPosition,
} from "./common";
import { IconFocusUnderline } from "./IconFocusUnderline";

import Box from "@/components/Box";
import Icon, { IconName } from "@/components/Icon";
import ButtonBorders from "@/components/SpriteSheet/BrushSvgs/ButtonBorders";
import Svg from "@/components/Svg";
import SubjectIcon from "@/components/SubjectIcon";
import ScreenReaderOnly from "@/components/ScreenReaderOnly";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import { OakColorName } from "@/styles/theme";
import { FontVariant } from "@/styles/utils/typography";
import { ResponsiveValues } from "@/styles/utils/responsive";

export const ButtonFocusUnderline = styled(Svg)<{
  $color: OakColorName;
}>`
  color: ${(props) => getColorByName(props.$color)};
  position: absolute;
`;
export const ButtonMinimalFocusUnderline = styled(Svg)<{
  $color: OakColorName;
}>`
  color: ${(props) => getColorByName(props.$color)};
  position: absolute;
`;
export const ButtonStyledAsLinkFocusUnderline = styled(Svg)<{
  $color: OakColorName;
}>`
  color: ${(props) => getColorByName(props.$color)};
  position: absolute;
`;
const BrushUnderline = styled(Svg)`
  position: absolute;
  mask-position: center;
  height: 8px;
  bottom: -10px;
`;
export type ButtonCurrentStyles = (
  | "arrow-icon"
  | "color"
  | "text-underline"
  | "underline"
)[];

export type ButtonInnerProps = {
  label: string;
  labelSuffixA11y?: string;
  icon?: IconName;
  subjectIcon?: string;
  iconBackground?: OakColorName;
  $iconPosition: IconPosition;
  shouldHideLabel?: boolean[];
  size: ButtonSize;
  background: ButtonBackground;
  variant: ButtonVariant;
  disabled?: boolean;
  isCurrent?: boolean;
  /**
   * currentStyles specifies which styles to apply when the button/link
   * has state `current`. In some cases the text is underlined, in others
   * it has an arrow icon.
   */
  currentStyles?: ButtonCurrentStyles;
  $font?: ResponsiveValues<FontVariant> | undefined;
};
const ButtonInner: FC<ButtonInnerProps> = (props) => {
  let { icon } = props;
  const { subjectIcon } = props;
  const {
    $iconPosition,
    iconBackground,
    size: buttonSize,
    label,
    labelSuffixA11y,
    shouldHideLabel,
    background,
    variant,
    isCurrent,
    currentStyles,
    $font,
  } = props;
  const iconSize = buttonIconSizeMap[buttonSize];

  const theme = useTheme();
  const defaultIconBackground = getButtonIconBackground(background)({ theme });

  const defactoBackground =
    ["minimal", "minimalNav", "buttonStyledAsLink"].includes(variant) &&
    iconBackground
      ? iconBackground
      : background;

  const underlineColor =
    theme.buttonFocusUnderlineColors[defactoBackground] ?? "black";

  if (isCurrent && currentStyles?.includes("arrow-icon")) {
    icon = "arrow-right";
  }

  /**
   * currentColor is the text/icon color when the button has state "current"
   * as standard, this applies to links (ButtonAsLink) when they link to the
   * current page. In this case `isCurrent=true` should be passed as a prop.
   * At the moment, currentColor is hardcoded, but there may come a time when
   * we need the value to depend on the original color of the button, in which
   * case it should come from theme.
   */
  const currentColor: OakColorName = "oakGrey4";
  const displayProperty = shouldHideLabel?.map((hide) =>
    hide ? "none" : "block",
  );
  const textDecoration =
    isCurrent && currentStyles?.includes("text-underline")
      ? "underline"
      : undefined;
  const color =
    isCurrent && currentStyles?.includes("color") ? currentColor : undefined;

  return (
    <>
      {icon && (
        <Flex
          $display={"inline-flex"}
          $position="relative"
          $alignItems="center"
          $mr={$iconPosition === "leading" ? 8 : 0}
          $ml={$iconPosition === "trailing" ? 8 : 0}
          $color={color}
        >
          <Icon
            variant="brush"
            name={icon}
            size={iconSize}
            $background={iconBackground ?? defaultIconBackground}
          />
          {(variant === "minimal" || variant === "minimalNav") && (
            <IconFocusUnderline $color={underlineColor} />
          )}
        </Flex>
      )}

      {subjectIcon && (
        <Flex
          $display={"inline-flex"}
          $position="relative"
          $alignItems="center"
          $color={currentColor}
          $ml={-8}
        >
          <SubjectIcon
            subjectSlug={subjectIcon}
            $maxHeight={40}
            $maxWidth={40}
            $height={iconSize}
          />
        </Flex>
      )}

      <Box $position={"relative"} $minWidth={0}>
        <Box
          $display={displayProperty}
          $textDecoration={textDecoration}
          $color={
            isCurrent && currentStyles?.includes("color")
              ? currentColor
              : undefined
          }
        >
          <ButtonLabel $font={$font}>
            {label}
            {labelSuffixA11y && (
              <ScreenReaderOnly> {labelSuffixA11y}</ScreenReaderOnly>
            )}
          </ButtonLabel>
        </Box>
        {(variant === "minimal" || variant === "minimalNav") && (
          <ButtonMinimalFocusUnderline
            $color={underlineColor}
            name="underline-1"
          />
        )}
        {variant === "minimal" &&
          currentStyles?.includes("underline") &&
          isCurrent && <BrushUnderline name="horizontal-rule" />}
      </Box>
      {(variant === "brush" || variant === "brushNav") && (
        <ButtonBorders background={background} />
      )}

      <ButtonFocusUnderline $color={underlineColor} name="underline-1" />

      {variant === "buttonStyledAsLink" && (
        <ButtonStyledAsLinkFocusUnderline $color={"black"} name="underline-1" />
      )}
    </>
  );
};

export default ButtonInner;
