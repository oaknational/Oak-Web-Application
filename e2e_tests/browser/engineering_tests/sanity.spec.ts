/**
 * Front page sanity test.
 */
import { expect } from "@playwright/test";

import { test } from "../fixtures";
import {
  pageUrl as frontPageUrl,
  locators as frontPageLocators,
} from "../pages/frontpage.page";

test.describe("Sanity Tests", () => {
  test("the app loads", async ({ page }) => {
    await page.goto(frontPageUrl);

    const pageTitle = page.locator(frontPageLocators.pageTitle);
    await expect(pageTitle).toHaveText(["Oak National Academy BETA"]);
  });
});
