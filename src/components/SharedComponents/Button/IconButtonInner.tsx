import { FC } from "react";
import { useTheme, styled } from "styled-components";

import Icon, { IconName } from "@/components/SharedComponents/Icon.deprecated";
import { OakColorName } from "@/styles/theme";

import {
  ButtonVariant,
  ButtonSize,
  getButtonIconBackground,
  ButtonBackground,
  getIconButtonHeight,
} from "./common";
import { IconFocusUnderline } from "./IconFocusUnderline";

// Create a wrapper component for the icon button
const IconButtonWrapper = styled.span<{
  size: ButtonSize;
  variant: ButtonVariant;
  background: ButtonBackground;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export interface IconButtonInnerProps {
  variant: ButtonVariant;
  size: ButtonSize;
  background: ButtonBackground;
  icon: IconName;
  iconColorOverride?: OakColorName;
  iconAnimateTo?: IconName;
}
/**
 * IconButtonInner is used by IconButton and IconLink
 * A minimal icon button, usually used in a nav, or form
 */
const IconButtonInner: FC<IconButtonInnerProps> = (props) => {
  const { variant, size, background, icon, iconColorOverride, iconAnimateTo } =
    props;

  const theme = useTheme();

  const iconVariant = variant === "minimal" ? "minimal" : "brush";
  const defaultIconBackground = getButtonIconBackground(background)({ theme });

  const underlineColor =
    theme.buttonFocusUnderlineColors[background] ?? "black";

  return (
    <IconButtonWrapper size={size} variant={variant} background={background}>
      <Icon
        variant={iconVariant}
        name={icon}
        size={getIconButtonHeight(size, variant)}
        $color={iconColorOverride}
        $background={
          variant === "minimal" ? "transparent" : defaultIconBackground
        }
        animateTo={iconAnimateTo}
      />
      <IconFocusUnderline $color={underlineColor} />
    </IconButtonWrapper>
  );
};

export default IconButtonInner;
