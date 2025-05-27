import { readFile } from "node:fs/promises";

import type { OakConfig } from "./config_types.js";

/**
 * Given a file path to a JSON config file, read it and return a promise for the parsed JSON.
 * @param filePath Path to config file.
 * @returns A promise for the config object.
 */
const readConfigFromFile = async (filePath: string): Promise<OakConfig> => {
  let configString: string;
  try {
    configString = await readFile(filePath, "utf-8");
  } catch (err) {
    console.error(`Failed to read config file at: "${filePath}"`);
    throw err;
  }

  let config: OakConfig;
  try {
    config = JSON.parse(configString);
  } catch (err) {
    console.error("Failed to parse config JSON string");
    throw err;
  }

  return config;
};

export default readConfigFromFile;
