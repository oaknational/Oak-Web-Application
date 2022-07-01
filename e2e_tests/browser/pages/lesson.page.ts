/**
 * `/lesson/[slug]` page interactions.
 *
 * Note, just data for now, encapsulating complex interactions would
 * require passing a page object instance, need to research the
 * "Playwright" way of doing this.
 * https://playwright.dev/docs/test-pom
 */

import { getPageUrl as _getPageUrl, validateUrl } from "./helpers";
import { locators as headerLocators } from "./sections/header.section";

/**
 * Given a lesson slug return the lesson URL.
 * @param slug The lesson slug.
 * @returns The absolute URL of the lesson.
 */
export const getPageUrl = (slug: string) => {
  const relativeUrl = `/beta/lessons/${slug}`;
  return _getPageUrl(relativeUrl);
};

/**
 * The regex pattern for an expected lesson page URL.
 * This could be more sophisticated, but works.
 */
export const PAGE_PATH_PATTERN = /^\/beta\/lessons\/[^/]+$/;

/**
 * Given a page URL determine if it matches the expected pattern.
 * @param url current page URL string.
 * @returns whether URL matches expected pattern.
 */
export const isValidUrl = (url: string) => {
  return validateUrl(url, PAGE_PATH_PATTERN);
};

// CSS selectors to find elements on a page. Used to construct Playwright `Locators`.
export const locators = {
  ...headerLocators,
  pageTitle: "css=main header h1",
};
