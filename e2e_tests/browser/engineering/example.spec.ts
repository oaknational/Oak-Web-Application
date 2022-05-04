import { expect } from "@playwright/test";

import { test } from "../fixtures";

const baseUrl =
  // Set in the CI env.
  /** @todo move to config file? */
  process.env.BASE_URL ||
  // Because of config in "playwright.config.ts",
  // `PLAYWRIGHT_TEST_BASE_URL` will be `localhost:3000` in local test environments.
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
  // The string default is to keep Typescript happy.
  "localhost:3000";
const frontPageUrl = new URL(baseUrl).href;

const locators = {
  homePageTitle: "[data-testid='home-page-title']",
};

test.beforeEach(async ({ page }) => {
  await page.goto(frontPageUrl);
});

test.describe("Does Playwright work", () => {
  test("we can do things on the front page", async ({ page }) => {
    await expect(page.locator(locators.homePageTitle)).toHaveText([
      "Oak National Academy",
    ]);
  });
});
