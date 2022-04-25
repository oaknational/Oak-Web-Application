import { expect } from "@playwright/test";

import { getPageUrl } from "../pages/helpers";
import { test } from "../fixtures";

const locators = {
  lessonTitle: "[data-testid='lesson-title']",
};

test.beforeEach(async ({ page }) => {
  const frontPageUrl = getPageUrl("/");
  await page.goto(frontPageUrl);
});

test.describe("Does Playwright work", () => {
  test("we can do things on the front page", async ({ page }) => {
    await expect(page.locator(locators.lessonTitle)).toHaveText([
      "Physics only review",
    ]);
  });
});
