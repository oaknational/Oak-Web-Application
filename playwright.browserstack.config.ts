/**
 * Config for running Playwright tests against Browserstack.
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

const LOCAL_TESTING = process.env.LOCAL_E2E === "on";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./e2e_tests/browser/engineering",
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
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
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
  config.globalSetup = require.resolve("e2e_tests/browser/start_bs_local.js");
  config.globalTeardown = require.resolve("e2e_tests/browser/stop_bs_local.js");
}

export default config;
