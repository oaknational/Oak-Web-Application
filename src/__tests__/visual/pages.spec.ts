import { test, TestInfo } from "@playwright/test";
import { takeSnapshot } from "@chromatic-com/playwright";

const getDeploymentTestUrls = require("../../common-lib/urls/getDeploymentTestUrls");

for (const path of getDeploymentTestUrls()) {
  if (typeof path === "object" && path !== null) {
    continue;
  }

  test(path, { tag: "@visual" }, async ({ page }, testInfo: TestInfo) => {
    await page.goto(path, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await page.locator("#__next:not(:has([data-testid='loading']))").waitFor();

    await takeSnapshot(page, testInfo); // To be used in conjunction with Chromatic for comparison
  });
}
