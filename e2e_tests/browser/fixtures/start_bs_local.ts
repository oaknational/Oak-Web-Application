/**
 * Start Browserstack-local.
 *
 * Based on https://github.com/browserstack/playwright-browserstack/blob/main/playwright-test/global-setup.js
 */

import { promisify } from "util";

import { bsLocal, BS_LOCAL_ARGS } from ".";

const boundStart = bsLocal.start.bind(bsLocal);
const startBsLocal = promisify(boundStart);

export default async () => {
  console.log("Starting BrowserStack Local");

  try {
    // Starts the Local instance with the required arguments
    await startBsLocal(BS_LOCAL_ARGS);
  } catch (err) {
    console.error("Error starting BrowserStack Local");
    throw err;
  }
  console.log("BrowserStack Local started");
};
