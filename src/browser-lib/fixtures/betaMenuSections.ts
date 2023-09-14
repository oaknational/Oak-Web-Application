import { cloneDeep } from "lodash";

import { menuSections } from "./menuSections";

import { MenuSections } from "@/components/MenuLinks/types";
import { BetaMenuSections } from "@/components/NewMenuSections/NewMenuSections";

// TODO: rename
export const newBetaMenuSections: BetaMenuSections = [
  {
    header: "Teachers",
    links: [
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Home",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Early release units",
        new: true,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Key stage 1",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Key stage 2",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Key stage 3",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Key stage 4",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "EYFS",
        new: false,
        external: true,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Specialist",
        new: false,
        external: true,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Curriculum plans",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Teacher Hub (old)",
        new: false,
        external: true,
      },
    ],
  },
  {
    header: "Pupils",
    links: [
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Learn online",
        new: false,
        external: true,
      },
    ],
  },
  {
    header: "Oak",
    links: [
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Plan a lesson",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Support your team",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Blogs",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Webinars",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "About us",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Contact us",
        new: false,
        external: false,
      },
      {
        resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
        text: "Help",
        new: false,
        external: false,
      },
    ],
  },
];

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
