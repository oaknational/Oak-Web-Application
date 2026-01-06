#!/usr/bin/env node

/**
 * This script will pull the specifed config from the cloud-storage bucket into
 * the directory /oak-config/ (over-writing previous contents).
 */

const util = require("util");
const path = require("path");
const execFile = util.promisify(require("child_process").execFile);

const OAK_CONFIG_PATH = path.join(__dirname, "../../../oak-config/");
const GCLOUD_BUCKET_PATH = "gs://oak-config/";

async function checkGcloudInstalled() {
  try {
    await execFile("gcloud", ["--version"]);
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error: gcloud is not installed on the system.");
    console.error(
      "Please install it to continue: https://docs.cloud.google.com/sdk/docs/install-sdk"
    );
    process.exit(1);
  }
}

async function run() {
  await checkGcloudInstalled();
  await execFile("gcloud", [
    "storage",
    "cp",
    `${GCLOUD_BUCKET_PATH}*`,
    `${OAK_CONFIG_PATH}`,
  ]);
}

run();
