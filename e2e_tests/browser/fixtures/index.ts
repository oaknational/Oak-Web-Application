/**
 * Decorate the Playwright page object with methods required
 * to run the test on Browserstack.
 *
 * For non-Browserstack Playwright projects, use default page object.
 *
 * @todo don't do all the fancy Browserstack stuff if we aren't using it.
 * @todo fix the Typescript issues below, search for @ts-ignore
 *
 * Based on https://github.com/browserstack/playwright-browserstack/tree/main/playwright-test
 */
import cp from "child_process";

import BrowserStackLocal from "browserstack-local";
import baseTest from "@playwright/test";

import { IS_CI, LOCAL_TESTING } from "./flags";

// Detect the Playwright version so we can pass it to Browserstack.
const clientPlaywrightVersion = cp
  .execSync("npx playwright --version")
  .toString()
  .trim()
  .split(" ")[1];

/**
 * @todo in a CI env construct this from the branch and PR number if it exists,
 * otherwise "production", the version number _might_ be in the `main` branch
 * package.json by the time this runs, check.
 */
function getBuild() {
  if (IS_CI) {
    const branchName = process.env.BRANCH_NAME;
    const prNumber = process.env.PR_NUMBER;
    if (prNumber) {
      return `${branchName} - PR: ${prNumber}`;
    } else if (branchName) {
      return branchName === "main" ? "production" : branchName;
    } else {
      return "Could not determine build";
    }
  } else {
    return "Unknown build";
  }
}

// Get the Browserstack credentials
const browserstackAccessKey = process.env.BROWSERSTACK_ACCESS_KEY;
const browserstackUsername = process.env.BROWSERSTACK_USERNAME;

// BrowserStack Specific Capabilities.
const caps = {
  browser: "chrome",
  browser_version: "latest",
  os: "osx",
  os_version: "catalina",
  name: "PLACEHOLDER TEST NAME",
  build: LOCAL_TESTING ? "local testing" : getBuild(),
  "browserstack.username": browserstackUsername,
  "browserstack.accessKey": browserstackAccessKey,
  // Will only affect runs where the Playwright project includes `@browserstack`
  // otherwise local testing will run against local Playwright browser instances.
  "browserstack.local": process.env.LOCAL_E2E === "on" || false,
  "client.playwrightVersion": clientPlaywrightVersion,
};

export const bsLocal = new BrowserStackLocal.Local();
export const BS_LOCAL_ARGS = {
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

export const test = baseTest.extend({
  page: async ({ page, playwright }, use, testInfo) => {
    // Use BrowserStack Launched Browser according to capabilities for cross-browser testing.
    if (testInfo.project.name.match(/browserstack/)) {
      if (!browserstackAccessKey) {
        throw new TypeError("process.env.BROWSERSTACK_ACCESS_KEY no defined.");
      }
      if (!browserstackUsername) {
        throw new TypeError("process.env.BROWSERSTACK_USERNAME not defined.");
      }

      let vBrowser;
      let vPage;
      try {
        patchCaps(testInfo.project.name, testInfo.title);
        const wsEndpoint =
          `wss://cdp.browserstack.com/playwright?caps=` +
          `${encodeURIComponent(JSON.stringify(caps))}`;
        vBrowser = await playwright.chromium.connect(wsEndpoint);
        vPage = await vBrowser.newPage(testInfo.project.use);
        const testError = `${
          testInfo.error ? `Errors: ${testInfo.errors.join("\n")} .` : ""
        }`;
        const testAnnotationsString = testInfo.annotations.reduce(
          (message, annotation) => {
            return message + `${annotation.type}: ${annotation.description}\n`;
          },
          ""
        );
        const testReason = `${testError}${testAnnotationsString}`;
        await use(vPage);
        const testResult = {
          action: "setSessionStatus",
          arguments: {
            status: testInfo.status,
            reason: testReason,
          },
        };
        await vPage.evaluate(() => {
          // No-op
        }, `browserstack_executor: ${JSON.stringify(testResult)}`);
      } catch (err) {
        console.error(err);
        const testResult = {
          action: "setSessionStatus",
          arguments: {
            status: "error",
            // eslint-disable-next-line
            // @ts-ignore
            reason: err.message,
          },
        };
        // eslint-disable-next-line
        // @ts-ignore
        await vPage.evaluate(() => {
          // No-op
        }, `browserstack_executor: ${JSON.stringify(testResult)}`);
      } finally {
        // eslint-disable-next-line
        // @ts-ignore
        await vPage.close();
        // eslint-disable-next-line
        // @ts-ignore
        await vBrowser.close();
      }
      // Not using Browserstack, don't decorate page object.
    } else {
      use(page);
    }
  },
});
