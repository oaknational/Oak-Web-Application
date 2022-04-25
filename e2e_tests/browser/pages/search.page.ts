/**
 * `/search` page interactions.
 *
 * Note, just data for now, encapsulating complex interactions would
 * require passing a page object instance, need to research the
 * "Playwright" way of doing this.
 * https://playwright.dev/docs/test-pom
 */

import { getPageUrl } from "./helpers";

// Note, this won't work for dynamic routes. We could provide a pattern
// to check against, but programmatic navigation would require a URL
// to be constructed from a pattern and slugs or other arguments.
const RELATIVE_URL = "search";
export const pageUrl = getPageUrl(RELATIVE_URL);

// CSS selectors to find elements on a page. Used to construct Playwright `Locators`.
export const locators = {
  headerSearchInput: "css=header input[type='search']",
  headerSearchSubmit: "css=header button[type='submit']",
  // Could nest child selectors?
  searchResults: { list: "css=[data-testid='search-results']", item: "css=li" },
};
