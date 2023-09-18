import { ResolveOakHrefProps } from "@/common-lib/urls";

type HrefLink = { href: string };

export const linkIsHref = (input: unknown): input is HrefLink => {
  return typeof (input as HrefLink).href === "string";
};

export type BetaMenuLink = {
  text: string;
  new: boolean;
  external: boolean;
  linkTo: ResolveOakHrefProps | HrefLink;
};

export type BetaMenuSection = {
  header: string;
  links: Array<BetaMenuLink>;
};

export type BetaMenuSections = Array<BetaMenuSection>;
