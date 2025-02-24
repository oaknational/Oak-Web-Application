import { FC } from "react";
import { useTheme } from "styled-components";

import {
  ButtonBackground,
  ButtonSize,
  ButtonVariant,
  getIconButtonHeight,
} from "./common";
import IconButtonWrapper from "./IconButtonWrapper";
import { IconFocusUnderline } from "./IconFocusUnderline";

import { OakColorName } from "@/styles/theme";
import Icon, {
  IconName,
  isIconVariant,
} from "@/components/SharedComponents/Icon.deprecated";
import { OakIcon } from "@oaknational/oak-components";

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

  const iconVariant = variant.replace("Nav", "");
  const theme = useTheme();
  const underlineColor = "black";

  return (
    <IconButtonWrapper size={size} variant={variant} background={background}>
      {/* <Icon
        variant={isIconVariant(iconVariant) ? iconVariant : undefined}
        name={icon}
        size={getIconButtonHeight(size, variant)}
        $color={iconColorOverride}
        $background={variant === "minimal" ? "transparent" : background}
        animateTo={iconAnimateTo}
      /> */}

      <IconFocusUnderline $color={underlineColor} />
    </IconButtonWrapper>
  );
};

export default IconButtonInner;
