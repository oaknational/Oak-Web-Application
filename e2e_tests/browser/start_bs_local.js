/**
 * Start Browserstack-local.
 *
 * Based on https://github.com/browserstack/playwright-browserstack/blob/main/playwright-test/global-setup.js
 */

const { promisify } = require("util");

const { bsLocal, BS_LOCAL_ARGS } = require("./fixtures");

const sleep = promisify(setTimeout);
const redColour = "\x1b[31m";
const whiteColour = "\x1b[0m";
module.exports = async () => {
  console.log("Starting BrowserStackLocal ...");
  // Starts the Local instance with the required arguments
  let localResponseReceived = false;
  bsLocal.start(BS_LOCAL_ARGS, (err) => {
    if (err) {
      console.error(
        `${redColour}Error starting BrowserStackLocal${whiteColour}`
      );
    } else {
      console.log("BrowserStackLocal Started");
    }
    localResponseReceived = true;
  });
  while (!localResponseReceived) {
    await sleep(1000);
  }
};
