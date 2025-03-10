import { fileURLToPath } from "url";
import path from "path";

/**
 * A helper function to get the equivalent of Node.js CommonJS __filename in ES modules
 * @param importMetaUrl The import.meta.url from the caller module
 * @returns The file path equivalent to CommonJS __filename
 */
export function getFilename(importMetaUrl: string): string {
  return fileURLToPath(new URL(".", importMetaUrl));
}

/**
 * A helper function to get the equivalent of Node.js CommonJS __dirname in ES modules
 * @param importMetaUrl The import.meta.url from the caller module
 * @returns The directory path equivalent to CommonJS __dirname
 */
export function getDirname(importMetaUrl: string): string {
  return path.dirname(fileURLToPath(new URL(".", importMetaUrl)));
}
