/**
 * A utility module that provides __dirname and __filename functionality
 * for code that needs to work in ES Module environments.
 */

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/**
 * Get the equivalent of __filename
 * @param importMetaUrl In ES Module context, pass import.meta.url. Not needed in CommonJS.
 * @returns The filename path
 */
export function getFilename(importMetaUrl?: string): string {
  if (!importMetaUrl) {
    throw new Error("import.meta.url must be provided in ES Module context");
  }

  return fileURLToPath(importMetaUrl);
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

  return dirname(fileURLToPath(importMetaUrl));
}
