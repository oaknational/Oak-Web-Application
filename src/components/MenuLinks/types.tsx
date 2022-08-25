import { OakFontName, PixelSpacing } from "../../styles/theme";
import { MarginProps } from "../../styles/utils/spacing";

export type MenuListElementProps = {
  fontFamily: OakFontName;
  fontSize: [PixelSpacing];
  href: string;
  linkText: string;
  currentPath: string;
  arrowSize: PixelSpacing[];
} & MarginProps;

export type MenuLinkProps = {
  menuLinks: Omit<MenuListElementProps, "currentPath">[];
  currentPath: string;
};
