import { extractCloudinaryIdFromURL } from "./extractCloudinaryIdFromURL";

import OakError from "@/errors/OakError";

describe(extractCloudinaryIdFromURL, () => {
  it("returns the cloudinary id from a url", () => {
    const url =
      "https://res.cloudinary.com/mockcloudinary/image/upload/image.png";

    expect(extractCloudinaryIdFromURL(url)).toBe("image.png");
  });

  it("preserves the version alongside the id", () => {
    const url =
      "https://res.cloudinary.com/mockcloudinary/image/upload/v123/image.png";

    expect(extractCloudinaryIdFromURL(url)).toBe("v123/image.png");
  });

  it("throws when the URL does not match a cloudinary URL", () => {
    const url = "https://example.com/image.png";

    expect(() => extractCloudinaryIdFromURL(url)).toThrow(
      new OakError({
        code: "cloudinary/failed-to-extract-id-from-url",
        meta: {
          url,
        },
      }),
    );
  });
});
