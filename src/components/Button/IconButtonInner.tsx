import { FC } from "react";
import { useTheme } from "styled-components";

import { OakColorName } from "../../styles/theme";
import Icon, { IconName } from "../Icon";

import {
  ButtonBackground,
  ButtonSize,
  ButtonVariant,
  getIconButtonHeight,
} from "./common";
import IconButtonWrapper from "./IconButtonWrapper";
import { IconFocusUnderline } from "./IconFocusUnderline";

export type IconButtonInnerProps = {
  variant: ButtonVariant;
  background: ButtonBackground;
  icon: IconName;
  size: ButtonSize;
  iconColorOverride?: OakColorName;
  iconAnimateTo?: IconName;
};
/**
 * ## Usage
 * This is not a general purpose component, it should only be used inside the
 * IconButton and IconButtonAsLink components.
 * If you just want an icon, use the Icon component.
 */
const IconButtonInner: FC<IconButtonInnerProps> = (props) => {
  const { variant, size, background, icon, iconColorOverride, iconAnimateTo } =
    props;
  const theme = useTheme();
  const underlineColor =
    theme.buttonFocusUnderlineColors[background] || "black";

  return (
    <IconButtonWrapper size={size} variant={variant} background={background}>
      <Icon
        variant={variant}
        name={icon}
        size={getIconButtonHeight(size, variant)}
        $color={iconColorOverride}
        $background={variant === "minimal" ? "transparent" : background}
        animateTo={iconAnimateTo}
      />
      <IconFocusUnderline $color={underlineColor} />
    </IconButtonWrapper>
  );
};

export default IconButtonInner;
