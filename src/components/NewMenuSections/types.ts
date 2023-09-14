import { ResolveOakHrefProps } from "@/common-lib/urls";

export type BetaMenuLink = {
  resolveOakHrefProps: ResolveOakHrefProps;
  text: string;
  new: boolean;
  external: boolean;
};

export type BetaMenuSection = {
  header: string;
  links: Array<BetaMenuLink>;
};

export type BetaMenuSections = Array<BetaMenuSection>;
