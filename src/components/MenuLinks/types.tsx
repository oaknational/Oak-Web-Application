export type MenuLinkSize = "small" | "medium" | "large";

export type MenuLinkProps = {
  href: string;
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
