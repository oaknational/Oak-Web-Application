import { OakFontName } from "../../styles/theme";
import { MarginProps } from "../../styles/utils/spacing";

export type MenuListElementProps = {
  fontFamily: OakFontName;
  fontSize: number[];
  href: string;
  linkText: string;
  currentPath: string;
} & MarginProps;

export type MenuLinkProps = {
  menuLinks: Omit<MenuListElementProps, "currentPath">[];
  currentPath: string;
};
