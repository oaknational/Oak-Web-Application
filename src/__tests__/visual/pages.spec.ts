import { devices, type TestInfo } from "@playwright/test";
import { test, takeSnapshot } from "@chromatic-com/playwright";

const getDeploymentTestUrls: () => (
  | string
  | { url: string; timeout: number }
)[] = require("../../common-lib/urls/getDeploymentTestUrls");

const visualConfigs = [
  { id: "desktop", ...devices["Desktop Chrome"] },
  {
    id: "mobile",
    ...devices["iPhone 17"],
    defaultBrowserType: "chromium" as const,
  },
  {
    id: "tablet",
    ...devices["iPad Pro 11"],
    defaultBrowserType: "chromium" as const,
  },
] as const;

for (const config of visualConfigs) {
  test.describe(config.id, () => {
    test.use({
      viewport: config.viewport,
      userAgent: config.userAgent,
      deviceScaleFactor: config.deviceScaleFactor,
      isMobile: config.isMobile,
      hasTouch: config.hasTouch,
    });

    for (const entry of getDeploymentTestUrls()) {
      const path = typeof entry === "string" ? entry : entry.url;
      const timeout = typeof entry === "string" ? 60_000 : entry.timeout;

      test(
        `[${config.id}] ${path}`,
        { tag: "@visual" },
        async ({ page }, testInfo: TestInfo) => {
          await page.goto(path, {
            waitUntil: "domcontentloaded",
            timeout,
          });

          await page
            .locator("#__next:not(:has([data-testid='loading']))")
            .waitFor();

          await takeSnapshot(page, config.id, testInfo);
        },
      );
    }
  });
}
