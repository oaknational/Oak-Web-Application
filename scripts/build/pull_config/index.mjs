#!/usr/bin/env node

/**
 * This script will pull the specifed config from the cloud-storage bucket into
 * the directory /oak-config/ (over-writing previous contents).
 */

import { promisify } from "node:util";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile as execFileCb } from "node:child_process";
import chalk from "chalk";

const execFile = promisify(execFileCb);

const __dirname = dirname(fileURLToPath(import.meta.url));
const OAK_CONFIG_PATH = join(__dirname, "../../../oak-config/");
const GCLOUD_BUCKET_PATH = "gs://oak-config/";

async function checkGcloudInstalled() {
  try {
    await execFile("gcloud", ["--version"]);
  } catch (error) {
    console.error(
      chalk.red.bold("🛑 gcloud --version errored. Do you need to install gcloud? Probably! 😱")
    );
    console.error(chalk.dim(error));
    console.error(
      chalk.cyan(
        "👉 Install gcloud cli here: https://docs.cloud.google.com/sdk/docs/install-sdk ☁️"
      )
    );
    process.exit(1);
  }
}

await checkGcloudInstalled();
await execFile("gcloud", [
  "storage",
  "cp",
  `${GCLOUD_BUCKET_PATH}*`,
  `${OAK_CONFIG_PATH}`,
]);
console.log(chalk.green.bold("✅ Config pulled successfully!"));
