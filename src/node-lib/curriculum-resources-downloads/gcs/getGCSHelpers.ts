/**
 * @fileoverview
 * GCS helpers for downloading files and generating signed URLs.
 * Used by the lesson asset download endpoint.
 */

import { Storage } from "@google-cloud/storage";

/**
 * Converts a byte size into a human readable format
 */
const sizes = ["B", "KB", "MB", "GB"];
export const convertFileSize = (
  value: number,
  processCount: number = 0,
): string => {
  const parsedValue = value / 1024;
  if (parsedValue < 1 && processCount < 3) {
    return `${Math.round(value)} ${sizes[processCount]}`;
  } else if (parsedValue < 1 && processCount === 3) {
    return `${Math.round(value * 10) / 10} ${sizes[processCount]}`;
  } else {
    return convertFileSize(parsedValue, processCount + 1);
  }
};

export function getGCSHelpers({ storage }: { storage: Storage }) {
  async function checkFileExistsInBucket({
    gcsFilePath,
    gcsBucketName,
  }: {
    gcsFilePath: string;
    gcsBucketName: string;
  }): Promise<boolean> {
    const bucket = storage.bucket(gcsBucketName);
    const file = bucket.file(gcsFilePath);

    const [exists] = await file.exists();

    return exists;
  }

  async function getFileSize({
    gcsFilePath,
    gcsBucketName,
  }: {
    gcsFilePath: string;
    gcsBucketName: string;
  }) {
    const bucket = storage.bucket(gcsBucketName);
    const file = bucket.file(gcsFilePath);

    const size = await file.getMetadata().then((data) => {
      return data[0]?.size;
    });

    if (size) {
      const filesize = typeof size === "number" ? size : parseInt(size);
      const formattedSize = convertFileSize(filesize);
      return formattedSize;
    }

    return undefined;
  }

  // Combined check for file existence and metadata in a single GCS call.
  async function checkFileExistsAndGetSize({
    gcsFilePath,
    gcsBucketName,
  }: {
    gcsFilePath: string;
    gcsBucketName: string;
  }): Promise<{ exists: boolean; fileSize?: string }> {
    const bucket = storage.bucket(gcsBucketName);
    const file = bucket.file(gcsFilePath);
    try {
      const [metadata] = await file.getMetadata();
      const size = metadata?.size;

      let formattedSize: string | undefined;
      if (size) {
        const filesize = typeof size === "number" ? size : parseInt(size);
        formattedSize = convertFileSize(filesize);
      }

      return { exists: true, fileSize: formattedSize };
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === 404) {
        return { exists: false };
      }

      throw error;
    }
  }

  const getSignedUrl = async ({
    gcsFilePath,
    gcsBucketName,
    shouldProxy,
  }: {
    gcsFilePath: string;
    gcsBucketName: string;
    shouldProxy?: boolean;
  }): Promise<string> => {
    const bucket = storage.bucket(gcsBucketName);
    const file = bucket.file(gcsFilePath);
    const expires = new Date();

    expires.setHours(expires.getHours() + 1);
    const [url] = await file.getSignedUrl({
      expires,
      action: "read",
    });

    if (shouldProxy) {
      const [, signedPath] = url.split(gcsBucketName);

      return ["https://", gcsBucketName, signedPath].join("");
    }

    return url;
  };

  /**
   * Fetch a file from GCS and return as Buffer.
   * Used for downloading resources to include in ZIP files.
   */

  async function fetchResourceAsBuffer({
    gcsFilePath,
    gcsBucketName,
  }: {
    gcsFilePath: string;
    gcsBucketName: string;
  }): Promise<Buffer> {
    const bucket = storage.bucket(gcsBucketName);
    const file = bucket.file(gcsFilePath);

    const [contents] = await file.download();
    return contents;
  }

  /**
   * Upload a buffer to GCS.
   * Used for uploading generated ZIP files.
   */
  async function uploadBuffer({
    gcsFilePath,
    gcsBucketName,
    buffer,
    contentType = "application/zip",
  }: {
    gcsFilePath: string;
    gcsBucketName: string;
    buffer: Buffer;
    contentType?: string;
  }): Promise<void> {
    const bucket = storage.bucket(gcsBucketName);
    const file = bucket.file(gcsFilePath);

    await file.save(buffer, {
      contentType,
      resumable: false,
    });
  }

  return {
    checkFileExistsInBucket,
    getFileSize,
    checkFileExistsAndGetSize,
    getSignedUrl,
    fetchResourceAsBuffer,
    uploadBuffer,
  };
}

export type GCSHelpers = ReturnType<typeof getGCSHelpers>;
