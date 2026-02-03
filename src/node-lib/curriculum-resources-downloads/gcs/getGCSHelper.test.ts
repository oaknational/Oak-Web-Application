import { Bucket } from "@google-cloud/storage";

import { convertFileSize, getGCSHelpers } from "./getGCSHelpers";

describe("gcsHelpers", () => {
  describe("checkFileExistsInBucket", () => {
    const existsMock = jest.fn();
    const { checkFileExistsInBucket } = getGCSHelpers({
      // @ts-expect-error only passing storage to test the function
      storage: {
        bucket: () =>
          ({
            file: jest.fn().mockImplementation(() => ({
              exists: existsMock,
            })),
          }) as unknown as Bucket,
      },
    });
    it("should return true if file exists", async () => {
      existsMock.mockResolvedValueOnce([true]);
      const result = await checkFileExistsInBucket({
        gcsBucketName: "gcsBucketName",
        gcsFilePath: "gcsFilePath",
      });
      expect(result).toBe(true);
    });
    it("should return false if file does not exist", async () => {
      existsMock.mockResolvedValueOnce([false]);
      const result = await checkFileExistsInBucket({
        gcsBucketName: "gcsBucketName",
        gcsFilePath: "gcsFilePath",
      });
      expect(result).toBe(false);
    });
  });
  describe("convertFileSize", () => {
    it("converts a value into kb", () => {
      const result = convertFileSize(1000000);
      expect(result).toEqual("977 KB");
    });
    it("converts a value into mb", () => {
      const result = convertFileSize(1000000000);
      expect(result).toEqual("954 MB");
    });
    it("converts a value into gb to 1 decimal place", () => {
      const result = convertFileSize(1000000000000);
      expect(result).toEqual("931.3 GB");
    });
  });
  describe("getFileSize", () => {
    const fileSizeMock = jest.fn();
    const { getFileSize } = getGCSHelpers({
      // @ts-expect-error only passing storage to test the function
      storage: {
        bucket: () =>
          ({
            file: jest.fn().mockImplementation(() => ({
              getMetadata: fileSizeMock,
            })),
          }) as unknown as Bucket,
      },
    });
    it("should return undefined if file does not exist", async () => {
      fileSizeMock.mockResolvedValueOnce([]);
      const result = await getFileSize({
        gcsBucketName: "gcsBucketName",
        gcsFilePath: "gcsFilePath",
      });
      expect(result).toEqual(undefined);
    });
    it('should return true and "formattedSize" if file exists', async () => {
      fileSizeMock.mockResolvedValueOnce([{ size: 1000000 }]);
      const result = await getFileSize({
        gcsBucketName: "gcsBucketName",
        gcsFilePath: "gcsFilePath",
      });
      expect(result).toEqual("977 KB");
    });
  });
  describe("getFileWriteStream", () => {
    const createWriteStreamMock = jest.fn();
    const { getFileWriteStream } = getGCSHelpers({
      // @ts-expect-error only passing storage to test the function
      storage: {
        bucket: () =>
          ({
            file: jest.fn().mockImplementation(() => ({
              createWriteStream: createWriteStreamMock,
            })),
          }) as unknown as Bucket,
      },
    });
    it("should return file write stream", () => {
      createWriteStreamMock.mockReturnValueOnce("foo bar write stream");
      const result = getFileWriteStream({
        gcsBucketName: "gcsBucketName",
        gcsFilePath: "gcsFilePath",
      });
      expect(result).toBe("foo bar write stream");
    });
  });
  describe("getSignedUrl", () => {
    const getSignedUrlMock = jest.fn();
    const { getSignedUrl } = getGCSHelpers({
      // @ts-expect-error only passing storage to test the function
      storage: {
        bucket: () =>
          ({
            file: jest.fn().mockImplementation(() => ({
              getSignedUrl: getSignedUrlMock,
            })),
          }) as unknown as Bucket,
      },
    });
    it("should return proxied signed url if shouldProxy:true passed", async () => {
      const gcsBucketName = "test_bucket_name.thenational.academy";
      getSignedUrlMock.mockResolvedValueOnce([
        `https://example.com/${gcsBucketName}/gcsFilePath`,
      ]);
      const result = await getSignedUrl({
        gcsBucketName,
        gcsFilePath: "gcsFilePath",
        shouldProxy: true,
      });
      expect(result).toBe(
        "https://test_bucket_name.thenational.academy/gcsFilePath",
      );
    });
    it("should return original signed url if shouldProxy not passed", async () => {
      const gcsBucketName = "test_bucket_name.thenational.academy";
      const originalSignedUrl = `https://example.com/${gcsBucketName}/gcsFilePath`;
      getSignedUrlMock.mockResolvedValueOnce([originalSignedUrl]);
      const result = await getSignedUrl({
        gcsBucketName,
        gcsFilePath: "gcsFilePath",
      });
      expect(result).toBe(originalSignedUrl);
    });
  });
  describe("fetchResourceFromGCS", () => {
    const fileGetMock = jest.fn();
    const getSignedUrlMock = jest.fn();
    const { fetchResourceFromGCS } = getGCSHelpers({
      // @ts-expect-error only passing storage to test the function
      storage: {
        bucket: () =>
          ({
            file: jest.fn().mockImplementation(() => ({
              get: fileGetMock,
              getSignedUrl: getSignedUrlMock,
            })),
          }) as unknown as Bucket,
      },
    });

    it("should return file read stream", async () => {
      fileGetMock.mockResolvedValueOnce([{}]);
      getSignedUrlMock.mockResolvedValueOnce(["https://signed-url.com/file"]);

      const mockStream = "foo bar read stream";
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        body: mockStream,
      });

      // @ts-expect-error - partial ValidResource for testing
      const result = await fetchResourceFromGCS({
        gcsFilePath: "gcsFilePath",
        gcsBucketName: "gcsBucketName",
        type: "quiz-exit-answers--pdf",
      });

      expect(result).toBe(mockStream);
      expect(global.fetch).toHaveBeenCalledWith("https://signed-url.com/file");
    });
  });
});
