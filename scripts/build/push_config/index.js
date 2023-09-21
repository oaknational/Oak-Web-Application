#!/usr/bin/env node

/**
 * This script will pull the specified config from the cloud-storage bucket into
 * the directory /oak-config/live/ (over-writing previous contents).
 *
 * It will then compare the 'live' file with the 'local' file.
 * E.g. 'oak-config/oak.config.json' vs 'oak-config/oak.config.json'
 *
 * Changes will be displayed and you will be asked to confirm those changes, if
 * confirmed, the 'local' file will be pushed to the bucket.
 */

const util = require("util");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);
const execFile = util.promisify(require("child_process").execFile);

const jsonDiff = require("json-diff");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const OAK_CONFIG_PATH = path.join(__dirname, "../../../oak-config/");
const OAK_CONFIG_LIVE_PATH = path.join(OAK_CONFIG_PATH, "live");
const GCLOUD_BUCKET_PATH = "gs://oak-config/";
const getFileName = (environment) => {
  if (environment === "development") {
    return "oak.config.json";
  }
  if (environment === "production") {
    return "oak.config.production.json";
  }
  if (environment === "test") {
    return "oak.config.test.json";
  }

  throw new Error(
    "Environment must be either 'development' or 'production' or 'test'",
  );
};
const getLocalPath = (fileName) => path.join(OAK_CONFIG_PATH, fileName);
const getLivePath = (fileName) => path.join(OAK_CONFIG_LIVE_PATH, fileName);
const compareLocalAndLive = (fileName) => {
  const local = JSON.parse(fs.readFileSync(getLocalPath(fileName)).toString());
  const live = JSON.parse(fs.readFileSync(getLivePath(fileName)).toString());
  const diff = jsonDiff.diffString(live, local);

  return diff;
};
const cleanUpAndExit = async (error) => {
  await execFile("rm", ["-r", `${OAK_CONFIG_LIVE_PATH}`]);
  if (error) {
    throw error;
  } else {
    process.exit(0);
  }
};

[
  `exit`,
  `SIGINT`,
  `SIGUSR1`,
  `SIGUSR2`,
  `uncaughtException`,
  `SIGTERM`,
].forEach((eventType) => process.on(eventType, cleanUpAndExit));

async function run() {
  try {
    const fileName = getFileName(argv.environment);
    const localPath = getLocalPath(fileName);
    const livePath = getLivePath(fileName);
    const gcloudPath = `${GCLOUD_BUCKET_PATH}${fileName}`;

    await execFile("mkdir", ["-p", `${OAK_CONFIG_LIVE_PATH}`]);
    await execFile("gcloud", ["storage", "cp", `${gcloudPath}`, `${livePath}`]);

    const diff = compareLocalAndLive(fileName);
    if (diff.length === 0) {
      console.log(`There are no changes to ${fileName}, exiting.\n`);
      return cleanUpAndExit();
    }

    console.log(diff);

    rl.question(
      `Push the above changes to ${argv.environment} config? [yes]/no: `,
      async (answer) => {
        if (answer === "no" || answer === "n") {
          console.log("No changes were made, exiting.\n");
          return cleanUpAndExit();
        }

        console.log(`Pushing changes from ${localPath} to ${gcloudPath}`);

        await execFile("gcloud", [
          "storage",
          "cp",
          `${localPath}`,
          `${gcloudPath}`,
        ]);

        return cleanUpAndExit();
      },
    );
  } catch (error) {
    cleanUpAndExit(error);
  }
}

run();
