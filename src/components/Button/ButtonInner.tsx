import { FC } from "react";
import styled, { useTheme } from "styled-components";

import { OakColorName } from "../../styles/theme";
import Box from "../Box";
import Icon, { IconName } from "../Icon";
import ButtonBorders from "../SpriteSheet/BrushSvgs/ButtonBorders";
import Svg from "../Svg";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import ScreenReaderOnly from "../ScreenReaderOnly";

import ButtonIconWrapper from "./ButtonIconWrapper";
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

export type ButtonInnerProps = {
  label: string;
  labelSuffixA11y?: string;
  icon?: IconName;
  iconBackground?: OakColorName;
  iconPosition: IconPosition;
  shouldHideLabel?: boolean[];
  size: ButtonSize;
  background: ButtonBackground;
  variant: ButtonVariant;
  disabled?: boolean;
};
const ButtonInner: FC<ButtonInnerProps> = (props) => {
  const {
    iconPosition,
    iconBackground,
    size: buttonSize,
    icon,
    label,
    labelSuffixA11y,
    shouldHideLabel,
    background,
    variant,
  } = props;
  const iconSize = buttonIconSizeMap[buttonSize];

  const theme = useTheme();
  const defaultIconBackground = getButtonIconBackground(background)({ theme });

  const defactoBackground =
    variant === "minimal" && iconBackground ? iconBackground : background;

  const underlineColor =
    theme.buttonFocusUnderlineColors[defactoBackground] || "black";

  return (
    <>
      {icon && (
        <ButtonIconWrapper iconPosition={iconPosition}>
          <Icon
            variant="brush"
            name={icon}
            size={iconSize}
            $background={iconBackground || defaultIconBackground}
          />
          {variant === "minimal" && (
            <IconFocusUnderline $color={underlineColor} />
          )}
        </ButtonIconWrapper>
      )}

      <Box $position={"relative"}>
        <Box
          $display={shouldHideLabel?.map((hide) => (hide ? "none" : "block"))}
        >
          <ButtonLabel>
            {label}
            {labelSuffixA11y && (
              <ScreenReaderOnly> {labelSuffixA11y}</ScreenReaderOnly>
            )}
          </ButtonLabel>
        </Box>
        <ButtonMinimalFocusUnderline
          $color={underlineColor}
          name="Underline1"
        />
      </Box>
      {variant === "brush" && <ButtonBorders background={background} />}
      <ButtonFocusUnderline $color={underlineColor} name="Underline1" />
    </>
  );
};

export default ButtonInner;
