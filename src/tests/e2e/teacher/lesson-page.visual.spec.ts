import { takeSnapshot } from "@chromatic-com/playwright";
import type { TestInfo } from "@playwright/test";

import { test } from "../fixtures";

const getDeploymentTestUrls = require("../../../common-lib/urls/getDeploymentTestUrls");

for (const [index, entry] of getDeploymentTestUrls().entries()) {
  if (typeof entry === "object" && entry !== null) {
    continue;
  }

  const path = entry;
  const testTitle = `@visual [${index}] ${path}`;

  test(testTitle, { tag: "@visual" }, async ({ page }, testInfo: TestInfo) => {
    await page.goto(path, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await page.locator("#__next:not(:has([data-testid='loading']))").waitFor();

    await takeSnapshot(page, testTitle, testInfo);
  });
}

/*
 * TODOs:
 * - Configure ignored tests to potential hide visual tests from regular e2e flow
 */
