import {
  createAndStoreShareId,
  getConversionShareId,
  getShareId,
  getShareIdKey,
  storeConversionShareId,
} from "./createShareId";

describe("createShareId", () => {
  describe("getShareIdKey", () => {
    it("should return a determinate string based on the lessonSlug", () => {
      const lessonSlug = "lesson-1";
      const result = getShareIdKey(lessonSlug);
      expect(result).toEqual("sid-c2d05c");
    });
  });

  describe("getShareId", () => {
    it("should return the shareId from the storage", () => {
      const lessonSlug = "lesson-1";
      const key = getShareIdKey(lessonSlug);
      const obj: Record<string, string> = {};
      obj[key] = "1234";

      jest
        .spyOn(Storage.prototype, "getItem")
        .mockImplementationOnce((key: string) => {
          return JSON.stringify(obj[key]);
        });
      const result = getShareId(lessonSlug);
      expect(result).toEqual("1234");
    });
  });

  describe("createAndStoreShareId", () => {
    it("should return a key and id", () => {
      const lessonSlug = "lesson-1";
      const result = createAndStoreShareId(lessonSlug);
      expect(result).toHaveProperty("key");
      expect(result).toHaveProperty("id");

      expect(result.key).toEqual(getShareIdKey(lessonSlug));
    });

    it("should store the shareId storage", () => {
      const fn = jest.spyOn(Storage.prototype, "setItem");
      const lessonSlug = "lesson-1";
      const result = createAndStoreShareId(lessonSlug);
      const key = getShareIdKey(lessonSlug);
      expect(fn).toHaveBeenCalledWith(key, JSON.stringify(result.id));
    });
  });

  describe("storeConversionShareId", () => {
    it("should store the conversion shareId storage", () => {
      const fn = jest.spyOn(Storage.prototype, "setItem");
      const shareId = "1234";
      const key = `cv-${shareId}`;
      storeConversionShareId(shareId);
      expect(fn).toHaveBeenCalledWith(key, JSON.stringify(true));
    });

    it("should return the key", () => {
      const shareId = "1234";
      const key = storeConversionShareId(shareId);
      expect(key).toEqual(`cv-${shareId}`);
    });
  });

  describe("getConversionShareId", () => {
    it("should return the conversion shareId from the storage", () => {
      const shareId = "1234";
      const obj: Record<string, boolean> = {};
      obj[`cv-${shareId}`] = true;

      jest
        .spyOn(Storage.prototype, "getItem")
        .mockImplementationOnce((key: string) => {
          return JSON.stringify(obj[key]);
        });
      const result = getConversionShareId(shareId);
      expect(result).toEqual(true);
    });
  });
});
