/**
 * Decorate the Playwright page object with methods required
 * to run the test on Browserstack.
 *
 * Based on https://github.com/browserstack/playwright-browserstack/tree/main/playwright-test
 */
import cp from "child_process";

import BrowserStackLocal from "browserstack-local";
import base from "@playwright/test";

// Detect the Playwright version so we can pass it to Browserstack.
const clientPlaywrightVersion = cp
  .execSync("npx playwright --version")
  .toString()
  .trim()
  .split(" ")[1];

// Get the Browserstack credentials
const browserstackAccessKey = process.env.BROWSERSTACK_ACCESS_KEY;
if (!browserstackAccessKey) {
  throw new TypeError("process.env.BROWSERSTACK_ACCESS_KEY no defined.");
}
const browserstackUsername = process.env.BROWSERSTACK_USERNAME;
if (!browserstackUsername) {
  throw new TypeError("process.env.BROWSERSTACK_USERNAME not defined.");
}

// BrowserStack Specific Capabilities.
const caps = {
  browser: "chrome",
  browser_version: "latest",
  os: "osx",
  os_version: "catalina",
  name: "PLACEHOLDER TEST NAME",
  /**
   * @todo in a CI env construct this from the branch and PR number if it exists,
   * otherwise "production", the version number _might_ be in the `main` branch
   * package.json by the time this runs, check.
   *
   * If we aren't in CI set the build name to something like "local testing".
   */
  build: "playwright-build-1",
  "browserstack.username": browserstackUsername,
  "browserstack.accessKey": browserstackAccessKey,
  // Will only affect runs where the Playwright project includes `@browserstack`
  // otherwise local testing will run against local Playwright browser instances.
  "browserstack.local": process.env.LOCAL_E2E === "on" || false,
  "client.playwrightVersion": clientPlaywrightVersion,
};

exports.bsLocal = new BrowserStackLocal.Local();

exports.BS_LOCAL_ARGS = {
  key: browserstackAccessKey,
};

// Patching the capabilities dynamically according to the project name.
const patchCaps = (name: string, title: string) => {
  if (!name.includes("@browserstack")) {
    throw new TypeError(
      "Trying to run non-Browserstack project against Browserstack"
    );
  }
  const combination = name.split(/@browserstack/)[0] || "";
  const [browserCaps = "", osCaps = ""] = combination.split(/:/);
  const [browser, browser_version] = browserCaps.split(/@/);
  const osCapsSplit = osCaps.split(/ /);
  const os = osCapsSplit.shift();
  const os_version = osCapsSplit.join(" ");
  caps.browser = browser ? browser : "chrome";
  caps.browser_version = browser_version ? browser_version : "latest";
  caps.os = os ? os : "osx";
  caps.os_version = os_version ? os_version : "catalina";
  caps.name = title;
};

const isHash = (entity: Record<string, string>) =>
  Boolean(entity && typeof entity === "object" && !Array.isArray(entity));
/** @todo solve this typescript nightmare. */
const nestedKeyValue = (hash: Record<string, string>, keys: Array<string>) =>
  keys.reduce((_hash, key) => (isHash(_hash) ? _hash[key] : undefined), hash);

exports.test = base.test.extend({
  page: async ({ page, playwright }, use, testInfo) => {
    // Use BrowserStack Launched Browser according to capabilities for cross-browser testing.
    if (testInfo.project.name.match(/browserstack/)) {
      patchCaps(testInfo.project.name, `${testInfo.file} - ${testInfo.title}`);
      const vBrowser = await playwright.chromium.connect({
        wsEndpoint:
          `wss://cdp.browserstack.com/playwright?caps=` +
          `${encodeURIComponent(JSON.stringify(caps))}`,
      });
      const vPage = await vBrowser.newPage(testInfo.project.use);
      await use(vPage);
      const testResult = {
        action: "setSessionStatus",
        arguments: {
          status: testInfo.status,
          reason: nestedKeyValue(testInfo, ["error", "message"]),
        },
      };
      await vPage.evaluate(() => {
        // No-op
      }, `browserstack_executor: ${JSON.stringify(testResult)}`);
      await vPage.close();
      await vBrowser.close();
    } else {
      use(page);
    }
  },
});
