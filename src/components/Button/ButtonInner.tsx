import { FC } from "react";

import Icon, { IconName } from "../Icon";

import ButtonIconWrapper from "./ButtonIconWrapper";
import ButtonLabel from "./ButtonLabel";
import ButtonWrapper from "./ButtonWrapper";
import {
  buttonIconSizeMap,
  ButtonSize,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_ICON_POSITION,
  IconPosition,
} from "./common";

export type ButtonInnerProps = {
  label: string;
  icon?: IconName;
  iconPosition?: IconPosition;
  size?: ButtonSize;
};
const ButtonInner: FC<ButtonInnerProps> = (props) => {
  const {
    icon,
    iconPosition = DEFAULT_ICON_POSITION,
    size = DEFAULT_BUTTON_SIZE,
    label,
  } = props;
  return (
    <ButtonWrapper size={size} iconPosition={iconPosition}>
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
