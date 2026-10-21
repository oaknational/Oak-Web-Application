import { getCachedDoc } from "./getCachedHtml";
import { getParsedDocx } from "./getParsedDocx";
import { fileIds } from "./documentIds";

import { cacheData } from "@/node-lib/cache";

const mockCache = new Map<string, Awaited<ReturnType<typeof getParsedDocx>>>();

jest.mock("./getParsedDocx", () => ({ getParsedDocx: jest.fn() }));
jest.mock("@/node-lib/cache", () => ({
  cacheData: jest.fn((fn: typeof getParsedDocx, keys: string[]) => {
    return async (fileId: string) => {
      const key = JSON.stringify([keys, fileId]);
      const cached = mockCache.get(key);
      if (cached) return cached;
      const result = await fn(fileId);
      mockCache.set(key, result);
      return result;
    };
  }),
}));

describe("getCachedDoc", () => {
  const parse = jest.mocked(getParsedDocx);

  beforeEach(() => {
    parse.mockReset();
    mockCache.clear();
  });

  it("uses a namespaced conversion cache with document IDs as arguments", async () => {
    const result = {
      fileId: fileIds["pe-guide"],
      html: "<h1>PE</h1>",
      messages: [],
    };
    parse.mockResolvedValueOnce(result);
    await expect(getCachedDoc(fileIds["pe-guide"])).resolves.toEqual(result);
    await expect(getCachedDoc(fileIds["pe-guide"])).resolves.toEqual(result);
    expect(parse).toHaveBeenCalledTimes(1);
    expect(parse).toHaveBeenCalledWith(fileIds["pe-guide"]);
    expect(cacheData).toHaveBeenCalledWith(getParsedDocx, [
      "mammoth-preview",
      "v5",
    ]);
  });

  it("does not cache conversion failures and retries on the next request", async () => {
    const log = jest.spyOn(console, "error").mockImplementation(() => {});
    const fileId = fileIds["additional-materials"];
    const result = { fileId, html: "<p>Materials</p>", messages: [] };
    try {
      parse.mockRejectedValueOnce(new Error("Export unavailable"));
      await expect(getCachedDoc(fileId)).resolves.toEqual({
        fileId,
        error: true,
      });
      expect(log).toHaveBeenCalledWith(
        "Failed to parse DOCX",
        expect.any(Error),
      );
      parse.mockResolvedValueOnce(result);
      await expect(getCachedDoc(fileId)).resolves.toEqual(result);
      expect(parse).toHaveBeenCalledTimes(2);
    } finally {
      log.mockRestore();
    }
  });

  it("keeps a different document's output separate", async () => {
    const result = {
      fileId: fileIds.eyfs,
      html: "<h1>EYFS</h1>",
      messages: [],
    };
    parse.mockResolvedValueOnce(result);
    await expect(getCachedDoc(fileIds.eyfs)).resolves.toEqual(result);
    expect(parse).toHaveBeenCalledWith(fileIds.eyfs);
  });

  it("rejects documents outside the preview's allowlist before fetching", async () => {
    const log = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      await expect(getCachedDoc("another-doc")).resolves.toEqual({
        fileId: "another-doc",
        error: true,
      });
      expect(parse).not.toHaveBeenCalled();
      expect(log).toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
