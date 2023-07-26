import { FC } from "react";
import styled, { useTheme } from "styled-components";

import { OakColorName } from "../../styles/theme";
import Box from "../Box";
import Icon, { IconName } from "../Icon";
import ButtonBorders from "../SpriteSheet/BrushSvgs/ButtonBorders";
import Svg from "../Svg";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import ScreenReaderOnly from "../ScreenReaderOnly";
import { FontVariant } from "../../styles/utils/typography";
import { ResponsiveValues } from "../../styles/utils/responsive";
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

import SubjectIcon from "components/SubjectIcon";

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
  currentStyles?: ("arrow-icon" | "text-underline" | "color")[];
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
    (variant === "minimal" || variant === "buttonStyledAsLink") &&
    iconBackground
      ? iconBackground
      : background;

  const underlineColor =
    theme.buttonFocusUnderlineColors[defactoBackground] || "black";

  icon =
    isCurrent && currentStyles?.includes("arrow-icon") ? "arrow-right" : icon;

  /**
   * currentColor is the text/icon color when the button has state "current"
   * as standard, this applies to links (ButtonAsLink) when they link to the
   * current page. In this case `isCurrent=true` should be passed as a prop.
   * At the moment, currentColor is hardcoded, but there may come a time when
   * we need the value to depend on the original color of the button, in which
   * case it should come from theme.
   */
  const currentColor: OakColorName = "oakGrey4";

  return (
    <>
      {(icon || subjectIcon) && (
        <Flex
          $display={"inline-flex"}
          $position="relative"
          $alignItems="center"
          $mr={$iconPosition === "leading" && !subjectIcon ? 8 : 0}
          $ml={$iconPosition === "trailing" ? 8 : 0}
          $color={isCurrent ? currentColor : undefined}
        >
          {icon && (
            <Icon
              variant="brush"
              name={icon}
              size={iconSize}
              $background={iconBackground || defaultIconBackground}
            />
          )}
          {subjectIcon && (
            <SubjectIcon
              subjectSlug={subjectIcon}
              $ml={-8}
              height={40}
              width={40}
            />
          )}
          {variant === "minimal" && (
            <IconFocusUnderline $color={underlineColor} />
          )}
        </Flex>
      )}

      <Box $position={"relative"}>
        <Box
          $display={shouldHideLabel?.map((hide) => (hide ? "none" : "block"))}
          $textDecoration={
            isCurrent && currentStyles?.includes("text-underline")
              ? "underline"
              : undefined
          }
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
        {variant === "minimal" && (
          <ButtonMinimalFocusUnderline
            $color={underlineColor}
            name="underline-1"
          />
        )}
      </Box>
      {variant === "brush" && <ButtonBorders background={background} />}
      <ButtonFocusUnderline $color={underlineColor} name="underline-1" />
      {variant === "buttonStyledAsLink" && (
        <ButtonStyledAsLinkFocusUnderline $color={"black"} name="underline-1" />
      )}
    </>
  );
};

export default ButtonInner;
