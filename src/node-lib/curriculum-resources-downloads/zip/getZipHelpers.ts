/**
 * @fileoverview
 * This file exports getZipHelpers()
 * These zip helpers are intended to be used to create a zip file from a list
 * of files (read streams) and a write stream for writing the zip file to GCS.
 */

import { Writable } from "stream";

import archiver from "archiver";

import { FileForZip } from "../types/resource.types";

type Logger = {
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
};

export function getZipHelpers({
  lessonZipsDir,
  logger = console,
}: {
  lessonZipsDir: string;
  logger?: Logger;
}) {
  type ZipFromSelectionCallbacks = {
    onWarning?: (err: archiver.ArchiverError) => void;
    onError?: (err: archiver.ArchiverError) => void;
  };

  const createZipFromFileList = async ({
    fileList,
    callbacks: { onError, onWarning },
  }: {
    fileList: FileForZip[];
    callbacks: ZipFromSelectionCallbacks;
  }): Promise<archiver.Archiver> => {
    const archive = archiver("zip", {
      zlib: { level: 9 }, // most compressed
    });

    archive.on("warning", (err) => {
      onWarning?.(err);
    });

    archive.on("error", (err) => {
      onError?.(err);
    });

    await Promise.all(
      fileList.map(async (fileForZip) => {
        const stream = await fileForZip.getFileReadStream();

        archive.append(stream, { name: fileForZip.pathInZip });
      }),
    );

    return archive;
  };

  async function createAndUploadZip({
    zipFilePath,
    fileList,
    zipFileWriteStream,
  }: {
    zipFilePath: string;
    fileList: FileForZip[];
    zipFileWriteStream: Writable;
  }): Promise<void> {
    const onError = (err: Error) => {
      throw err;
    };

    const onWarning = (err: unknown) => {
      logger.warn(`Warning encountered while zipping ${zipFilePath}:`, err);
    };

    const archive = await createZipFromFileList({
      fileList,
      callbacks: {
        onError,
        onWarning,
      },
    });

    return new Promise((resolve, reject) => {
      archive
        .pipe(zipFileWriteStream)
        .on("error", (err: Error & { errors?: { message: string }[] }) => {
          // Errors here are from the write-stream, so GCS related
          // rather than archiving
          logger.log(err);
          const newError = new Error(
            `Failed to upload to cloud storage`,
          ) as Error & {
            fileName?: string;
            gcsErrors?: string;
          };

          newError.fileName = zipFilePath;
          newError.gcsErrors = err?.errors?.map((e) => e.message).join(", ");

          reject(newError);
        })
        .on("finish", () => {
          logger.log("Finished streaming zip to GCS", zipFilePath);
          resolve();
        });

      archive.finalize();
    });
  }

  /**
   * Gets signed url for download the zip.
   * If the zip doesn't exist or it is stale, then
   * create and upload the zip to GCS.
   */
  const getOrCreateZip = async ({
    zipFilePath,
    fileList,
    zipFileWriteStream,
    checkIfZipFileExists,
    getSignedUrlForZip,
  }: {
    zipFilePath: string;
    fileList: FileForZip[];
    zipFileWriteStream: Writable;
    checkIfZipFileExists: (zipFilePath: string) => Promise<boolean>;
    getSignedUrlForZip: (zipFilePath: string) => Promise<string>;
  }): Promise<string> => {
    const exists = await checkIfZipFileExists(zipFilePath);
    /**
     * If it doesn't exist in the cache go through the
     * much slower process of generating and uploading it
     *
     * n.b. it may be that no one has downloaded this
     * selection, or that assetsUpdatedAt has changed,
     * which in turn will change the fileName and zipFilePath
     *
     * n.b. no return value from createAndUploadZip as
     * if successful the file will be saved at zipFilePath,
     * and if it fails it will throw and propagate up
     */
    if (!exists) {
      logger.log(`Zip doesn't exist, creating:`, zipFilePath);
      await createAndUploadZip({
        zipFilePath,
        fileList,
        zipFileWriteStream,
      });
    }

    return getSignedUrlForZip(zipFilePath);
  };

  const getZipFilePath = ({ fileName }: { fileName: string }): string => {
    return `${lessonZipsDir}/${fileName}`;
  };

  return {
    getOrCreateZip,
    getZipFilePath,
  };
}

export type ZipHelpers = ReturnType<typeof getZipHelpers>;
