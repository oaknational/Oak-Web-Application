import { HTMLAttributeAnchorTarget } from "react";

import { OakFontName, PixelSpacing } from "../../styles/theme";
import { MarginProps } from "../../styles/utils/spacing";

export type MenuListItemProps = {
  fontFamily: OakFontName;
  fontSize: [PixelSpacing];
  href: string;
  target?: HTMLAttributeAnchorTarget;
  onClick?: () => void;
  linkText: string;
  currentPath: string;
  arrowSize: PixelSpacing[];
} & MarginProps;

export type MenuLinkProps = {
  menuLinks: Omit<MenuListItemProps, "currentPath">[];
  currentPath: string;
};
