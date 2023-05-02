import { cloneDeep } from "lodash";

import { MenuSections } from "../../components/MenuLinks/types";

import { menuSections } from "./menuSections";

export const betaMenuSections: MenuSections = {
  ...cloneDeep(menuSections),
};
if (betaMenuSections.large[0]) {
  betaMenuSections.large[0].linkText = "Home (early access)";
  betaMenuSections.large[0].resolveOakHrefProps.page = "home";
  if ("viewType" in betaMenuSections.large[0].resolveOakHrefProps) {
    betaMenuSections.large[0].resolveOakHrefProps.viewType = "teachers";
  }
}
