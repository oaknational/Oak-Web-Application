import { OakPageName } from "../../common-lib/urls";

export type MenuLinkSize = "small" | "medium" | "large";

export type MenuLinkProps = {
  page: OakPageName;
  size: MenuLinkSize;
  linkText: string;
  // for styling the active link
  activeLinkHrefMatch?: string;
};

type MenuSection = Omit<MenuLinkProps, "size">[];
export type MenuSections = Record<MenuLinkSize, MenuSection>;

export type MenuLinksProps = {
  menuSections: MenuSections;
};
