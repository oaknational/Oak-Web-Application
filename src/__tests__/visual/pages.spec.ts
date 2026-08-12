import { test, expect } from "@playwright/test";

const getDeploymentTestUrls = require("../../common-lib/urls/getDeploymentTestUrls");

for (const path of getDeploymentTestUrls()) {
  test(path, { tag: "@visual" }, async ({ page }) => {
    await page.goto(path, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await page.locator("#__next:not(:has([data-testid='loading']))").waitFor();

    await expect(page).toHaveScreenshot(`${path.replace("/", "-")}.png`, {
      fullPage: true,
    });
  });
}

/*
 * TODOs:
 * - Add either data-chromatic="ignore" or .chromatic-ignore class to videos and other elements we want to ignore, see data-percy-hide="contents"
 * - Set chromatic config to include disableAutoSnapshot: true if wan
 * - Configure desired browsers and viewports in playwright.config.ts projects
 * - Configure to test storybook stories too if desired
 */
