import { getSanityRefId, getImageDimensions } from "./sanityImageBuilder";

describe("getSanityRefId", () => {
  it("should return the string if imageSource is a string", () => {
    const result = getSanityRefId("image-123");
    expect(result).toBe("image-123");
  });

  it("should return asset _ref if present", () => {
    const imageSource = { asset: { _ref: "image-123-ref" } };
    const result = getSanityRefId(imageSource);
    expect(result).toBe("image-123-ref");
  });

  it("should return asset _id if _ref is not present", () => {
    const imageSource = { asset: { _id: "image-123-id" } };
    const result = getSanityRefId(imageSource);
    expect(result).toBe("image-123-id");
  });

  it("should return _ref if present in imageSource", () => {
    const imageSource = { _ref: "image-123-ref" };
    const result = getSanityRefId(imageSource);
    expect(result).toBe("image-123-ref");
  });

  it("should return _id if present in imageSource", () => {
    const imageSource = { _id: "image-123-id" };
    const result = getSanityRefId(imageSource);
    expect(result).toBe("image-123-id");
  });

  it("should return an empty string if no valid id is found", () => {
    const imageSource = {};
    const result = getSanityRefId(imageSource);
    expect(result).toBe("");
  });
});

describe("getImageDimensions", () => {
  it("should return undefined dimensions if fill is true", () => {
    const result = getImageDimensions("image-123-800x600", { fill: true });
    expect(result).toEqual({
      width: undefined,
      height: undefined,
      aspectRatio: undefined,
    });
  });

  it("should return default dimensions if id is undefined", () => {
    const result = getImageDimensions(undefined, { fill: false });
    expect(result).toEqual({ width: 0, height: 0, aspectRatio: undefined });
  });

  it("should return default dimensions if id does not contain dimensions", () => {
    const result = getImageDimensions("image-123", { fill: false });
    expect(result).toEqual({ width: 0, height: 0, aspectRatio: undefined });
  });

  it("should return parsed dimensions and aspect ratio if id contains valid dimensions", () => {
    const result = getImageDimensions("image-123-800x600", { fill: false });
    expect(result).toEqual({ width: 800, height: 600, aspectRatio: 800 / 600 });
  });

  it("should return default dimensions if width or height is not a number", () => {
    const result = getImageDimensions("image-123-800xNaN", { fill: false });
    expect(result).toEqual({ width: 0, height: 0, aspectRatio: undefined });
  });
});
