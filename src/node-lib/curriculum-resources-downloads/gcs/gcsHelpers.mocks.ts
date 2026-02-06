import { Readable, Writable } from "stream";

import type { GCSHelpers } from "./getGCSHelpers";

export function createMockReadableStream(): NodeJS.ReadableStream {
  const readable = new Readable({
    read() {
      this.push(Buffer.from("test-content"));
      this.push(null);
    },
  });
  return readable;
}

export function createMockWritableStream(): Writable {
  return new Writable({
    write(_chunk, _encoding, callback) {
      callback();
    },
  });
}

export function createMockGcsHelpers(
  overrides?: Partial<GCSHelpers>,
): GCSHelpers {
  return {
    checkFileExistsInBucket: jest.fn().mockResolvedValue(false),
    checkFileExistsAndGetSize: jest.fn().mockResolvedValue({
      exists: false,
      fileSize: undefined,
    }),
    getFileSize: jest.fn().mockResolvedValue("10MB"),
    getSignedUrl: jest.fn().mockImplementation(async ({ gcsFilePath }) => {
      return `https://signed-url.com/${gcsFilePath}`;
    }),
    fetchResourceFromGCS: jest
      .fn()
      .mockImplementation(() => Promise.resolve(createMockReadableStream())),
    getFileWriteStream: jest.fn().mockImplementation(() => {
      return createMockWritableStream();
    }),
    ...overrides,
  };
}
