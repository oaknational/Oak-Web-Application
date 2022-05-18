import { FC } from "react";

import Icon, { IconName } from "../Icon";

import ButtonIconWrapper from "./ButtonIconWrapper";
import ButtonLabel from "./ButtonLabel";
import ButtonWrapper from "./ButtonWrapper";
import {
  buttonIconSizeMap,
  ButtonSize,
  ButtonVariant,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  DEFAULT_ICON_POSITION,
  IconPosition,
} from "./common";

export type ButtonInnerProps = {
  label: string;
  variant?: ButtonVariant;
  icon?: IconName;
  iconPosition?: IconPosition;
  size?: ButtonSize;
};
const ButtonInner: FC<ButtonInnerProps> = (props) => {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    icon,
    iconPosition = DEFAULT_ICON_POSITION,
    size = DEFAULT_BUTTON_SIZE,
    label,
  } = props;
  return (
    <ButtonWrapper size={size} iconPosition={iconPosition} variant={variant}>
      {icon && (
        <ButtonIconWrapper iconPosition={iconPosition}>
          <Icon name={icon} size={buttonIconSizeMap[size]} />
        </ButtonIconWrapper>
      )}
      <ButtonLabel>{label}</ButtonLabel>
    </ButtonWrapper>
  );
};

export default ButtonInner;
