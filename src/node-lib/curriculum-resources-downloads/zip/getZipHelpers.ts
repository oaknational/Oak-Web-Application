/**
 * @fileoverview
 * ZIP file creation helpers using JSZip.
 * Used for generating lesson download ZIP files.
 */

import JSZip from "jszip";

export type ZipFile = {
  pathInZip: string;
  buffer: Buffer;
};

/**
 * Create a ZIP file from an array of files.
 *
 * @param files - Array of files to include in the ZIP
 * @returns Buffer containing the ZIP file
 * @throws Error if no files provided
 */
export async function createZipFromFiles(files: ZipFile[]): Promise<Buffer> {
  if (files.length === 0) {
    throw new Error("Must provide at least one file to create ZIP");
  }

  const zip = new JSZip();

  for (const { pathInZip, buffer } of files) {
    zip.file(pathInZip, buffer);
  }

  const zipBuffer = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9, // most compressed
    },
  });

  return Buffer.from(zipBuffer);
}

export type ZipHelpers = {
  createZipFromFiles: typeof createZipFromFiles;
};

export function getZipHelpers(): ZipHelpers {
  return {
    createZipFromFiles,
  };
}
