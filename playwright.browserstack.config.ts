/**
 * Config for running Playwright tests against Browserstack, locally or in CI.
 */

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// We do this so people can put their BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY
// in an env file for local Browserstack testing.
import "dotenv/config";
import type { PlaywrightTestConfig } from "@playwright/test";

import {
  IS_CI,
  LOCAL_TESTING,
  PLAYWRIGHT_REPORTER,
} from "./e2e_tests/browser/fixtures/flags";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./e2e_tests/browser/engineering_tests",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: LOCAL_TESTING ? 30000 : 5000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: IS_CI,
  /* Retry on CI only */
  retries: IS_CI ? 2 : 0,
  /*
    Our Browserstack subscription level supports 4 parallel test connections.
    GitHub Linux runners have two cores, so should manageable but need to keep
    an eye on it.
   */
  workers: IS_CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: PLAYWRIGHT_REPORTER || "list",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    // -- BrowserStack Projects --
    // name should be of the format browser@browser_version:os os_version@browserstack
    {
      name: "chrome@latest:Windows 10@browserstack",
      use: {
        browserName: "chromium",
        channel: "chrome",
      },
    },
  ],
};

if (LOCAL_TESTING) {
  // Start the dev server before the tests run.
  config.webServer = {
    command: "npm run dev",
    port: 3000,
  };

  // Start and stop Browserstack-local so the local server
  // can be tested on Browserstack.
  // The parameters take the value of the path to the files to run.
  config.globalSetup = require.resolve(
    "./e2e_tests/browser/fixtures/global_setup.ts"
  );
  config.globalTeardown = require.resolve(
    "./e2e_tests/browser/fixtures/global_teardown.ts"
  );
}

export default config;
