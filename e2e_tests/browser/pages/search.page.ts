/**
 * `beta/search` page interactions.
 *
 * Note, just data for now, encapsulating complex interactions would
 * require passing a page object instance, need to research the
 * "Playwright" way of doing this.
 * https://playwright.dev/docs/test-pom
 */

import { getPageUrl } from "./helpers";
import { locators as headerLocators } from "./sections/header.section";

// Note, this won't work for dynamic routes. We could provide a pattern
// to check against, but programmatic navigation would require a URL
// to be constructed from a pattern and slugs or other arguments.
const RELATIVE_URL = "beta/search";
export const pageUrl = getPageUrl(RELATIVE_URL);

// CSS selectors to find elements on a page. Used to construct Playwright `Locators`.
export const locators = {
  ...headerLocators,
  searchResults: {
    list: "css=[data-testid='search-results']",
    item: "css=li",
    itemLink: "css=a",
  },
};
