/**
 * Front (`/`) page interactions.
 */

import { getPageUrl } from "./helpers";
import { locators as headerLocators } from "./sections/header.section";

const RELATIVE_URL = "";
export const pageUrl = getPageUrl(RELATIVE_URL);

// CSS selectors to find elements on a page. Used to construct Playwright `Locators`.
export const locators = {
  ...headerLocators,
  pageTitle: "css=[data-testid='home-page-title']",
};
