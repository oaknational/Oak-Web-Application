import { FC } from "react";
import { useTheme } from "styled-components";

import Icon, { IconName } from "../Icon";
import ButtonBorders from "../SpriteSheet/BrushSvgs/ButtonBorders";

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

export type ButtonInnerProps = {
  label: string;
  icon?: IconName;
  iconPosition: IconPosition;
  size: ButtonSize;
  background: ButtonBackground;
  variant: ButtonVariant;
};
const ButtonInner: FC<ButtonInnerProps> = (props) => {
  const {
    iconPosition,
    size: buttonSize,
    icon,
    label,
    background,
    variant,
  } = props;
  const iconSize = buttonIconSizeMap[buttonSize];

  const theme = useTheme();
  const iconBackground = getButtonIconBackground(background)({ theme });
  return (
    <>
      {icon && (
        <ButtonIconWrapper iconPosition={iconPosition}>
          <Icon
            variant="brush"
            name={icon}
            size={iconSize}
            $background={iconBackground}
          />
        </ButtonIconWrapper>
      )}
      <ButtonLabel>{label}</ButtonLabel>
      {variant === "brush" && <ButtonBorders background={background} />}
    </>
  );
};

export default ButtonInner;
