import config from "../../config";

/**
 * In order to stop logs cluttering the console during tests, by default
 * do not send logs/errors to the console from the error-reporter in the
 * test environment
 */
const noop = () => null;
export const consoleLog =
  config.get("releaseStage") === "test" ? noop : console.log;
export const consoleError =
  config.get("releaseStage") === "test" ? noop : console.log;
