import { FC } from "react";
import styled, { useTheme } from "styled-components";
import { OakBox, OakColorToken, OakFlex } from "@oaknational/oak-components";

import {
  ButtonBackground,
  buttonIconSizeMap,
  ButtonSize,
  ButtonVariant,
  getButtonIconBackground,
  IconPosition,
} from "./common";

import ButtonLabel from "@/components/SharedComponents/Button/ButtonLabel";
import { IconFocusUnderline } from "@/components/SharedComponents/Button/IconFocusUnderline";
import type { IconFocusUnderlineProps } from "@/components/SharedComponents/Button/IconFocusUnderline";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import Icon, { IconName } from "@/components/SharedComponents/Icon.deprecated";
import ButtonBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/ButtonBorders";
import Svg from "@/components/SharedComponents/Svg";
import type { SvgName } from "@/components/SharedComponents/SpriteSheet/getSvgId";
import SubjectIcon from "@/components/SharedComponents/SubjectIcon";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import type { OakColorName } from "@/styles/theme";
import type { FontVariant } from "@/styles/utils/typography";
import type { ResponsiveValues } from "@/styles/utils/responsive";

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
  labelColor?: OakColorToken;
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
    labelColor,
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
  const currentColor: OakColorToken = "grey60";
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
        <OakFlex
          $display={"inline-flex"}
          $position="relative"
          $alignItems="center"
          $mr={
            $iconPosition === "leading"
              ? "space-between-ssx"
              : "space-between-none"
          }
          $ml={
            $iconPosition === "trailing"
              ? "space-between-ssx"
              : "space-between-none"
          }
          $color={color ?? labelColor}
        >
          <Icon
            variant="brush"
            name={icon}
            size={iconSize}
            $background={iconBackground ?? defaultIconBackground}
            data-testid="button-icon"
          />
          {(variant === "minimal" || variant === "minimalNav") && (
            <IconFocusUnderline $color={underlineColor} />
          )}
        </OakFlex>
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

      <OakBox $position={"relative"} $minWidth={"all-spacing-0"}>
        <OakBox
          $display={displayProperty}
          $textDecoration={textDecoration}
          $color={
            isCurrent && currentStyles?.includes("color")
              ? currentColor
              : undefined
          }
        >
          <ButtonLabel $font={$font} $color={labelColor}>
            {label}
            {labelSuffixA11y && (
              <ScreenReaderOnly> {labelSuffixA11y}</ScreenReaderOnly>
            )}
          </ButtonLabel>
        </OakBox>
        {(variant === "minimal" || variant === "minimalNav") && (
          <ButtonMinimalFocusUnderline
            $color={underlineColor}
            name="underline-1"
          />
        )}
        {variant === "minimal" &&
          currentStyles?.includes("underline") &&
          isCurrent && <BrushUnderline name="horizontal-rule" />}
      </OakBox>
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
