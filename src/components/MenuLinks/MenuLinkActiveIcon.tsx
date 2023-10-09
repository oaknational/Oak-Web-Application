import { FC } from "react";

import { PixelSpacing } from "../../styles/theme";
import Icon, { IconSize } from "../Icon";

import { MenuLinkSize } from "./types";

const ICON_SIZE: Record<MenuLinkSize, IconSize> = {
  small: [20],
  medium: [30],
  large: [30, 48],
};
const MARGIN_RIGHT: Record<MenuLinkSize, PixelSpacing[]> = {
  small: [8],
  medium: [12],
  large: [16],
};

type MenuLinkActiveIconProps = {
  href: string;
  size: MenuLinkSize;
};
const MenuLinkActiveIcon: FC<MenuLinkActiveIconProps> = (props) => {
  const { size } = props;

  return (
    <Icon
      variant="minimal"
      name="arrow-right"
      size={ICON_SIZE[size]}
      $opacity={0.6}
      $mr={MARGIN_RIGHT[size]}
    />
  );
};
export default MenuLinkActiveIcon;
