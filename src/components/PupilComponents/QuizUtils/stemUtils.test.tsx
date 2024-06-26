import { OakCloudinaryImage } from "@oaknational/oak-components";

import { getStemImage, getStemImageData } from "./stemUtils";

import { ImageOrTextItem } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

describe("stemUtils", () => {
  const stem: ImageOrTextItem[] = [
    {
      type: "image",
      imageObject: {
        secureUrl:
          "https://res.cloudinary.com/mockcloudinary/image/upload/image.png",
        publicId: "image",
        metadata: {},
      },
    },
    {
      type: "text",
      text: "This is a text",
    },
  ];

  describe("getStemImageData", () => {
    it("should return a StemImageData object if there is an image", () => {
      const result = getStemImageData(stem);
      expect(result?.type).toEqual("image");
    });
    it("should return undefined if there is no image", () => {
      const result = getStemImageData(stem.slice(1));
      expect(result).toBeUndefined();
    });
  });
  describe("getStemImage", () => {
    it("should return an OakImage with src from the stem", () => {
      const result = getStemImage({ stem, minWidth: "all-spacing-19" });
      expect(result?.type).toEqual(OakCloudinaryImage);
      expect(result?.props.cloudinaryId).toEqual("image");
    });
  });
});
