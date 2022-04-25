export const IS_CI = !!process.env.CI;
export const LOCAL_TESTING = process.env.LOCAL_E2E === "on";
export const PLAYWRIGHT_REPORTER = process.env.PLAYWRIGHT_REPORTER;

/**
 * @todo split this between BASE_URL in the config files with the fallback (including port),
 * and PLAYWRIGHT_TEST_BASE_URL here.
 **/
export const BASE_URL =
  // Set in the CI env.
  process.env.BASE_URL ||
  // Value of the `use:{baseUrl: }` value in the Playwright config files.
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
  // Default fallback value.
  "http://localhost:3000";
