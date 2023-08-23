import getBrowserConfig from "../../browser-lib/getBrowserConfig";

/**
 * In order to stop logs cluttering the console during tests, by default
 * do not send logs/errors to the console from the error-reporter in the
 * test environment
 */
const noop = () => null;
export const consoleLog =
  getBrowserConfig("releaseStage") === "test" ? noop : console.log;
export const consoleError =
  getBrowserConfig("releaseStage") === "test" ? noop : console.log;
