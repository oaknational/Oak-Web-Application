import { FullConfig } from "@playwright/test";

import stopBsLocal from "./stop_bs_local";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function globalTeardown(_config: FullConfig) {
  console.log("Playwright teardown");
  await stopBsLocal();
}

export default globalTeardown;
