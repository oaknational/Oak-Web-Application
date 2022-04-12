import { expect } from "@playwright/test";

import { test } from "../fixtures";

// Because of config in "playwright.config.ts",
// `PLAYWRIGHT_TEST_BASE_URL` will be `localhost:3000` in local test environments.
// The string default is to keep Typescript happy.
const frontPageUrl =
  process.env.BASE_URL ||
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
  "localhost:3000";

const locators = {
  lessonTitle: "[data-test-id='lesson-title']",
};

test.beforeEach(async ({ page }) => {
  await page.goto(frontPageUrl);
});

test.describe("Does Playwright work", () => {
  test("we can do things on the front page", async ({ page }) => {
    await expect(page.locator(locators.lessonTitle)).toHaveText([
      "Physics only review",
    ]);
  });
});
