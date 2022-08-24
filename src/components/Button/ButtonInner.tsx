import { FC } from "react";
import styled, { useTheme } from "styled-components";

import { OakColorName } from "../../styles/theme";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import Icon, { IconName } from "../Icon";
import ButtonBorders from "../SpriteSheet/BrushSvgs/ButtonBorders";
import Svg from "../Svg";

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

export const ButtonFocusUnderline = styled(Svg)<{ color: OakColorName }>`
  position: absolute;
  bottom: -4px;
  left: -4px;
  right: -7px;
  width: calc(100% + 12px);
  height: 10px;
  transform: rotate(-3deg);
  color: ${(props) => getColorByName(props.color)};
`;
export type ButtonInnerProps = {
  label: string;
  icon?: IconName;
  iconBackground?: OakColorName;
  iconPosition: IconPosition;
  size: ButtonSize;
  background: ButtonBackground;
  variant: ButtonVariant;
};
const ButtonInner: FC<ButtonInnerProps> = (props) => {
  const {
    iconPosition,
    iconBackground,
    size: buttonSize,
    icon,
    label,
    background,
    variant,
  } = props;
  const iconSize = buttonIconSizeMap[buttonSize];

  const theme = useTheme();
  const defaultIconBackground = getButtonIconBackground(background)({ theme });
  const underlineColor =
    theme.buttonFocusUnderlineColors[background] || "black";

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
        </ButtonIconWrapper>
      )}
      <ButtonLabel>{label}</ButtonLabel>
      {variant === "brush" && <ButtonBorders background={background} />}
      <ButtonFocusUnderline color={underlineColor} name="Underline1" />
    </>
  );
};

export default ButtonInner;
