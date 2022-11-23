import Bugsnag, {
  NotifiableError,
  OnErrorCallback,
  BrowserConfig as BugsnagConfig,
} from "@bugsnag/js";

/**
 * Wrapping Bugsnag.notify otherwise Vercel terminates the process before error is sent
 * See: https://github.com/bugsnag/bugsnag-js/issues/1360
 */
const bugsnagNotify = (error: NotifiableError, onError: OnErrorCallback) =>
  new Promise((resolve) => Bugsnag.notify(error, onError, resolve));

export default bugsnagNotify;
export type { BugsnagConfig };
