/**
 * A utility module that provides __dirname and __filename functionality
 * for code that needs to work in both CommonJS and ES Module environments.
 *
 * In CommonJS (like Jest), __dirname and __filename are already available.
 * In ES Modules, they need to be derived from import.meta.url.
 */

let fileURLToPath: ((url: string) => string) | undefined;
let pathDirname: ((path: string) => string) | undefined;

/**
 * Get the equivalent of __filename
 * @param importMetaUrl In ES Module context, pass import.meta.url. Not needed in CommonJS.
 * @returns The filename path
 */
export function getFilename(importMetaUrl?: string): string {
  if (!importMetaUrl) {
    throw new Error("import.meta.url must be provided in ES Module context");
  }

  // Use require in non-CommonJS environments
  // @ts-ignore
  const url = require("url");
  return url.fileURLToPath(importMetaUrl);
}

/**
 * Get the equivalent of __dirname
 * @param importMetaUrl In ES Module context, pass import.meta.url. Not needed in CommonJS.
 * @returns The directory path
 */
export function getDirname(importMetaUrl?: string): string {
  if (!importMetaUrl) {
    throw new Error("import.meta.url must be provided in ES Module context");
  }

  // Use require in non-CommonJS environments
  // @ts-ignore
  const url = require("url");
  // @ts-ignore
  const path = require("path");

  return path.dirname(url.fileURLToPath(importMetaUrl));
}
