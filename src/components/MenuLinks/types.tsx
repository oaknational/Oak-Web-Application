export type MenuLinkSize = "small" | "medium" | "large";

export type MenuLinkProps = {
  // fontFamily: OakFontName;
  // fontSize: [PixelSpacing];
  // oakPage: OakPageName;
  href: string;
  // target?: HTMLAttributeAnchorTarget;
  // onClick?: () => void;
  size: MenuLinkSize;
  linkText: string;
  // arrowSize: PixelSpacing[];
};

type MenuSection = Omit<MenuLinkProps, "size">[];
export type MenuSections = Record<MenuLinkSize, MenuSection>;

export type MenuLinksProps = {
  menuSections: MenuSections;
};
