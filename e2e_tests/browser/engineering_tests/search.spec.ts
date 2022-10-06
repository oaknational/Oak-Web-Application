/**
 * Journeys that start on the /search page.
 */
import { expect } from "@playwright/test";

import { test } from "../fixtures";
import {
  pageUrl as frontPageUrl,
  locators as frontPageLocators,
} from "../pages/frontpage.page";
import {
  pageUrl as searchPageUrl,
  locators as searchPageLocators,
} from "../pages/search.page";
import {
  PAGE_PATH_PATTERN as lessonUrlPattern,
  isValidUrl as isValidLessonUrl,
  locators as lessonPageLocators,
} from "../pages/lesson.page";

test.describe("Search", () => {
  // Unit tests should have exactly one assertion, but sometimes it makes
  // sense for a user journey test to have two or three.
  test.skip("can be used to navigate to lessons", async ({ page }) => {
    // Start the journey on the front page
    await page.goto(frontPageUrl);

    // Use the header search form to search for "Macbeth".
    const searchInput = page.locator(frontPageLocators.headerSearchInput);
    await searchInput.type("Macbeth");

    // Click the submit button.
    // Could have used `searchInput.press('enter')` instead.
    const headerSearchSubmit = page.locator(
      frontPageLocators.headerSearchSubmit
    );
    await headerSearchSubmit.click();

    // Assert we are now on the /search page.
    // Wait for any page specific element, then check URL.
    /** @todo encapsulate this into a standard page validation method. */
    const testElement = page.locator(searchPageLocators.searchResults.list);
    await testElement.waitFor();
    expect(page.url()).toBe(searchPageUrl);

    // Get a reference to the top result.
    // This constructs a `Locator`, the element reference
    // is fetched at interaction time.
    const resultsLocators = searchPageLocators.searchResults;
    const firstSearchResult = page
      // Grab the list,
      .locator(resultsLocators.list)
      // Then nested grab the list items.
      .locator(resultsLocators.item)
      .first();

    // Assert on the first result.
    await expect(firstSearchResult).toContainText(/macbeth/i);

    // Click on the first result link.
    await firstSearchResult.locator(resultsLocators.itemLink).click();

    // Assert we are now on a lesson page.
    const lessonPageTitle = page.locator(lessonPageLocators.pageTitle);
    await lessonPageTitle.waitFor();
    const pageUrl = page.url();
    expect(
      isValidLessonUrl(pageUrl),
      `Expected page URL to match path pattern: "${lessonUrlPattern}", got: "${pageUrl}"`
    ).toBe(true);
  });
});
