import { expect } from "@playwright/test";

import { test } from "../fixtures";
import {
  pageUrl as searchPageUrl,
  locators as searchLocators,
} from "../pages/search.page";

test.beforeEach(async ({ page }) => {
  await page.goto(searchPageUrl);
});

test.describe("Search", () => {
  test("can happen on the /search page", async ({ page }) => {
    // Type in the search term.
    const searchInput = page.locator(searchLocators.headerSearchInput);
    await searchInput.type("Macbeth");

    // Click the submit button. Could have used `searchInput.press('enter')` instead.
    const headerSearchSubmit = page.locator(searchLocators.headerSearchSubmit);
    headerSearchSubmit.click();

    // Get a reference to the top result.
    // This constructs a `Locator`, the element reference
    // is fetched at interaction time.
    const firstSearchResult = page
      // Grab the list,
      .locator(searchLocators.searchResults.list)
      // Then nested grab the list items.
      .locator(searchLocators.searchResults.item)
      .first();

    // Assert on the result.
    await expect(firstSearchResult).toContainText(/macbeth/i);
  });
});
