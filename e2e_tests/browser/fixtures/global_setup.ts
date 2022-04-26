import { FullConfig } from "@playwright/test";

import startBsLocal from "./start_bs_local";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function globalSetup(_config: FullConfig) {
  console.log("Playwright setup");
  await startBsLocal();
}

export default globalSetup;
