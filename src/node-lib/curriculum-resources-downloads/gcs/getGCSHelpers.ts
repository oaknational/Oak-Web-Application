/**
 * @fileoverview
 * This file exports getGCSHelpers()
 * These GCS helpers are intended to be used to download and upload files to GCS.
 * They are used by the zip helpers to create a zip file from a list of files.
 */

import type { ReadableStream as WebReadableStream } from "node:stream/web";

import { Storage } from "@google-cloud/storage";

import type { ValidResource } from "../types/resource.types";

import OakError from "@/errors/OakError";

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
  const fetchResourceFromGCS = async ({
    gcsFilePath,
    gcsBucketName,
    type,
  }: ValidResource): Promise<WebReadableStream> => {
    const bucket = storage.bucket(gcsBucketName);
    const file = bucket.file(gcsFilePath);

    try {
      await file.get();
    } catch (err) {
      throw new OakError({
        code: "downloads/file-not-found",
        meta: { type, gcsFilePath, gcsBucketName },
        originalError: err,
      });
    }

    const url = await getSignedUrl({ gcsFilePath, gcsBucketName });

    if (!url) {
      throw new OakError({
        code: "downloads/failed-to-fetch",
        meta: {
          reason: "No url from file.getSignedUrl",
          gcsFilePath,
          gcsBucketName,
        },
      });
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new OakError({
        code: "downloads/failed-to-fetch",
        meta: {
          reason: "Response not ok from fetch(url)",
          status: response.status,
          gcsFilePath,
          gcsBucketName,
        },
      });
    }

    if (!response.body) {
      throw new OakError({
        code: "downloads/failed-to-fetch",
        meta: {
          reason: "No body in response object from fetch(url)",
          gcsFilePath,
          gcsBucketName,
        },
      });
    }

    return response.body as WebReadableStream;
  };

  function getFileWriteStream({
    gcsFilePath,
    gcsBucketName,
  }: {
    gcsFilePath: string;
    gcsBucketName: string;
  }) {
    const bucket = storage.bucket(gcsBucketName);
    const file = bucket.file(gcsFilePath);
    const fileWriteStream = file.createWriteStream();

    return fileWriteStream;
  }

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

  return {
    checkFileExistsInBucket,
    getFileSize,
    checkFileExistsAndGetSize,
    fetchResourceFromGCS,
    getFileWriteStream,
    getSignedUrl,
  };
}

export type GCSHelpers = ReturnType<typeof getGCSHelpers>;
