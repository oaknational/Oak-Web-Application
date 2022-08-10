import { FC } from "react";

import { OakColorName } from "../../styles/theme";
import Icon, { IconName } from "../Icon";

import {
  ButtonBackground,
  ButtonSize,
  ButtonVariant,
  getButtonHeight,
} from "./common";
import IconButtonWrapper from "./IconButtonWrapper";

export type IconButtonInnerProps = {
  variant: ButtonVariant;
  background: ButtonBackground;
  icon: IconName;
  size: ButtonSize;
  iconColorOverride?: OakColorName;
};
const IconButtonInner: FC<IconButtonInnerProps> = (props) => {
  const { variant, size, background, icon, iconColorOverride } = props;

  return (
    <IconButtonWrapper size={size} variant={variant} background={background}>
      <Icon
        variant={variant}
        name={icon}
        size={getButtonHeight(size)}
        $color={iconColorOverride}
        $background={variant === "minimal" ? "transparent" : background}
      />
    </IconButtonWrapper>
  );
};

export default IconButtonInner;
