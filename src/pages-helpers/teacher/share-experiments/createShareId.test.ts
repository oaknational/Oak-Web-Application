import {
  createAndStoreShareId,
  getConversionShareId,
  getShareIdFromCookie,
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

  describe("getShareIdFromCookie", () => {
    it("should return the shareId from the cookie", () => {
      const lessonSlug = "lesson-1";
      const key = getShareIdKey(lessonSlug);
      document.cookie = `${key}=1234`;
      const result = getShareIdFromCookie(lessonSlug);
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

    it("should store the shareId in a cookie", () => {
      const lessonSlug = "lesson-1";
      const result = createAndStoreShareId(lessonSlug);
      const key = getShareIdKey(lessonSlug);
      expect(document.cookie).toContain(`${key}=${result.id}`);
    });
  });

  describe("storeConversionShareId", () => {
    it("should store the conversion shareId in a cookie", () => {
      const shareId = "1234";
      const key = `cv-${shareId}`;
      storeConversionShareId(shareId);
      expect(document.cookie).toContain(`${key}=true`);
    });

    it("should return the key", () => {
      const shareId = "1234";
      const key = storeConversionShareId(shareId);
      expect(key).toEqual(`cv-${shareId}`);
    });
  });

  describe("getConversionShareId", () => {
    it("should return the conversion shareId from the cookie", () => {
      const shareId = "1234";
      const key = `cv-${shareId}`;
      document.cookie = `${key}=true`;
      const result = getConversionShareId(shareId);
      expect(result).toEqual("true");
    });
  });
});
