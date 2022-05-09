const { readFile } = require("fs/promises");

/**
 * Given a file path to a JSON config file, read it and return a promise for the parsed JSON.
 * @param {string} filePath Path to config file.
 * @returns A promise for the config object.
 */
const readConfigFromFile = async (filePath) => {
  /**
   * @type {string}
   * @description The JSON config string read from file.
   */
  let configString;
  try {
    configString = await readFile(filePath, "utf-8");
  } catch (err) {
    console.error(`Failed to read config file at: "${filePath}"`);
    throw err;
  }

  /** @description The config object to return. */
  let config;
  try {
    config = JSON.parse(configString);
  } catch (err) {
    console.error("Failed to parse config JSON string");
    throw err;
  }

  return config;
};

module.exports = readConfigFromFile;
