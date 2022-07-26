import { FC } from "react";

import { OakColorName } from "../../styles/theme";
import Icon, { IconName } from "../Icon";

import {
  buttonIconSizeMap,
  ButtonSize,
  ButtonVariant,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
} from "./common";
import IconButtonWrapper from "./IconButtonWrapper";

export type IconButtonInnerProps = {
  variant?: ButtonVariant;
  icon: IconName;
  size?: ButtonSize;
  iconColorOverride?: OakColorName;
};
const IconButtonInner: FC<IconButtonInnerProps> = (props) => {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    size = DEFAULT_BUTTON_SIZE,
    icon,
    iconColorOverride,
  } = props;

  return (
    <IconButtonWrapper size={size} variant={variant}>
      <Icon
        name={icon}
        size={buttonIconSizeMap[size]}
        $color={iconColorOverride}
      />
    </IconButtonWrapper>
  );
};

export default IconButtonInner;
