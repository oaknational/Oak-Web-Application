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
