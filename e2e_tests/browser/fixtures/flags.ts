export const IS_CI = !!process.env.CI;
export const LOCAL_TESTING = process.env.LOCAL_E2E === "on";
export const PLAYWRIGHT_REPORTER = process.env.PLAYWRIGHT_REPORTER;
