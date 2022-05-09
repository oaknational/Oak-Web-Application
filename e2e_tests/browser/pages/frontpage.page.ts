/**
 * Front (`/`) page interactions.
 */

import { getPageUrl } from "./helpers";

const RELATIVE_URL = "";
export const pageUrl = getPageUrl(RELATIVE_URL);

// CSS selectors to find elements on a page. Used to construct Playwright `Locators`.
export const locators = {
  pageTitle: "[data-testid='home-page-title']",
};
