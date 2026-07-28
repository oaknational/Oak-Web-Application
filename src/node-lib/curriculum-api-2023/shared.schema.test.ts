/**
 * @jest-environment node
 */
import { lessonOverviewQuizQuestionSchema } from "./shared.schema";

const secureUrl =
  "https://oaknationalacademy-res.cloudinary.com/image/upload/v1687374653/Trees.jpg";

const parseImageStem = (imageObject: Record<string, unknown>) => {
  const question = lessonOverviewQuizQuestionSchema.parse({
    questionId: 1,
    questionUid: "QUES-TEST-00001",
    questionType: "multiple-choice",
    questionStem: [{ type: "image", imageObject }],
    feedback: "",
    hint: "",
    active: false,
  });

  const stem = question.questionStem[0];

  if (!stem || stem.type !== "image") {
    throw new Error("Expected an image stem");
  }

  return stem.imageObject.alt;
};

describe("stem image alt", () => {
  it("Defaults to the Cloudinary context alt", () => {
    expect(
      parseImageStem({
        secureUrl,
        context: { custom: { alt: "Context alt" } },
        metadata: { assetDescription: "Metadata alt" },
        displayName: "Display name",
      }),
    ).toBe("Context alt");
  });

  it("falls back to the metadata asset description", () => {
    expect(
      parseImageStem({
        secureUrl,
        metadata: { assetDescription: "Metadata alt" },
        displayName: "Display name",
      }),
    ).toBe("Metadata alt");
  });

  it("falls back to the display name", () => {
    expect(
      parseImageStem({
        secureUrl,
        metadata: [],
        displayName: "Display name",
      }),
    ).toBe("Display name");
  });

  it("is undefined when no source is available", () => {
    expect(parseImageStem({ secureUrl, metadata: [] })).toBeUndefined();
  });
});
