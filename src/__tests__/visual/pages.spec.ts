import { test, TestInfo } from "@playwright/test";
import { takeSnapshot } from "@chromatic-com/playwright";

const getDeploymentTestUrls: () => (
  | string
  | { url: string; timeout: number }
)[] = require("../../common-lib/urls/getDeploymentTestUrls");

for (const entry of getDeploymentTestUrls()) {
  const path = typeof entry === "string" ? entry : entry.url;
  const timeout = typeof entry === "string" ? 60_000 : entry.timeout;

  test(path, { tag: "@visual" }, async ({ page }, testInfo: TestInfo) => {
    await page.goto(path, {
      waitUntil: "domcontentloaded",
      timeout,
    });

    await page.locator("#__next:not(:has([data-testid='loading']))").waitFor();

    await takeSnapshot(page, testInfo); // To be used in conjunction with Chromatic for comparison
  });
}
