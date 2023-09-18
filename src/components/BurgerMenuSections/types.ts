import { ResolveOakHrefProps } from "@/common-lib/urls";

/**
 * Types for the burger menu links and sections used in the new teacher experience
 */

type HrefLink = { href: string };

export const linkIsHref = (input: unknown): input is HrefLink => {
  return typeof (input as HrefLink).href === "string";
};

export type BurgerMenuLink = {
  text: string;
  new: boolean;
  external: boolean;
  linkTo: ResolveOakHrefProps | HrefLink;
};

export type BurgerMenuSection = {
  header: string;
  links: Array<BurgerMenuLink>;
};

export type BurgerMenuSections = Array<BurgerMenuSection>;
