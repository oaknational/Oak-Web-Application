import { test, TestInfo } from "@playwright/test";
import { takeSnapshot } from "@chromatic-com/playwright";

const getDeploymentTestUrls: () => (
  | string
  | { url: string; timeout: number }
)[] = require("../../common-lib/urls/getDeploymentTestUrls");

for (let path of getDeploymentTestUrls()) {
  let timeout = 60_000;
  if (typeof path === "object" && path !== null) {
    path = path.url;
    timeout = path.timeout;
  }

  test(path, { tag: "@visual" }, async ({ page }, testInfo: TestInfo) => {
    await page.goto(path, {
      waitUntil: "domcontentloaded",
      timeout,
    });

    await page.locator("#__next:not(:has([data-testid='loading']))").waitFor();

    await takeSnapshot(page, testInfo); // To be used in conjunction with Chromatic for comparison
  });
}
