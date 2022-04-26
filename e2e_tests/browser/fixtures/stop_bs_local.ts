/**
 * Stop Browserstack-local.
 *
 * Based on https://github.com/browserstack/playwright-browserstack/blob/main/playwright-test/global-teardown.js
 */

import { promisify } from "util";

import { bsLocal } from ".";

const boundStop = bsLocal.stop.bind(bsLocal);
const stopBsLocal = promisify(boundStop);

export default async () => {
  // Stop the Local instance after your test run is completed, i.e after driver.quit
  if (bsLocal) {
    if (bsLocal.isRunning()) {
      try {
        await stopBsLocal();
      } catch (err) {
        console.error("Failed to stop Browserstack Local.");
        throw err;
      }
      console.log("BrowserStack Local stopped");
    } else {
      console.log("BrowserStack Local not running");
    }
  }
};
