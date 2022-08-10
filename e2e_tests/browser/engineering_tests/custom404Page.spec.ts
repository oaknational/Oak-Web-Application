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
  pageHeading: "[data-testid='404Heading']",
};

test.beforeEach(async ({ page }) => {
  await page.goto(frontPageUrl);
});

test.describe("404 Not found", () => {
  test("Should respond with 404 is page not found", async ({ page }) => {
    const response = await page.goto(`${frontPageUrl}/not-a-page`);
    expect(response?.status()).toBe(404);
    await expect(page.locator(locators.pageHeading)).toHaveText([
      "Whoops! It looks like you have fallen too far from the tree.",
    ]);
  });
  test("Should respond with 404 with incorrect lesson slug", async ({
    page,
  }) => {
    const response = await page.goto(
      `${frontPageUrl}/beta/lessons/not-a-lesson-slug`
    );
    expect(response?.status()).toBe(404);
    await expect(page.locator(locators.pageHeading)).toHaveText([
      "Whoops! It looks like you have fallen too far from the tree.",
    ]);
  });
});
