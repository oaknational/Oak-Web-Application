import { FC } from "react";
import { useTheme } from "styled-components";

import { OakColorName } from "../../styles/theme";
import Icon, { IconName } from "../Icon";

import {
  ButtonBackground,
  ButtonSize,
  ButtonVariant,
  getButtonHeight,
} from "./common";
import IconButtonWrapper from "./IconButtonWrapper";
import { IconFocusUnderline } from "./IconFocusUnderline";

export type IconButtonInnerProps = {
  variant: ButtonVariant;
  background: ButtonBackground;
  icon: IconName;
  size: ButtonSize;
  iconColorOverride?: OakColorName;
};
const IconButtonInner: FC<IconButtonInnerProps> = (props) => {
  const { variant, size, background, icon, iconColorOverride } = props;
  const theme = useTheme();
  const underlineColor =
    theme.buttonFocusUnderlineColors[background] || "black";

  return (
    <IconButtonWrapper size={size} variant={variant} background={background}>
      <Icon
        variant={variant}
        name={icon}
        size={getButtonHeight(size, variant)}
        $color={iconColorOverride}
        $background={variant === "minimal" ? "transparent" : background}
      />
      <IconFocusUnderline $color={underlineColor} />
    </IconButtonWrapper>
  );
};

export default IconButtonInner;
