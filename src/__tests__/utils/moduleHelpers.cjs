const { fileURLToPath } = require("url");
const path = require("path");

/**
 * A helper function to get the equivalent of Node.js CommonJS __filename in ES modules
 * @param {string} importMetaUrl The import.meta.url from the caller module
 * @returns {string} The file path equivalent to CommonJS __filename
 */
function getFilename(importMetaUrl) {
  return fileURLToPath(new URL(".", importMetaUrl));
}

/**
 * A helper function to get the equivalent of Node.js CommonJS __dirname in ES modules
 * @param {string} importMetaUrl The import.meta.url from the caller module
 * @returns {string} The directory path equivalent to CommonJS __dirname
 */
function getDirname(importMetaUrl) {
  return path.dirname(fileURLToPath(new URL(".", importMetaUrl)));
}

module.exports = {
  getFilename,
  getDirname,
};
