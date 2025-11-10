import { StemPortableText } from "@/components/SharedComponents/Stem";
import { convertQuestionItem } from "./quizMathjax";

describe("quizMathjax", () => {
  it("converts quiz text items", () => {
    const result = convertQuestionItem({
      type: "text",
      text: "test",
    });
    expect(result).toHaveProperty("portableText");
    expect((result as StemPortableText).portableText).toHaveLength(1);
  });
  it("does not convert quiz image items", () => {
    const result = convertQuestionItem({
      type: "image",
      imageObject: { secureUrl: "secureUrl2", metadata: [] },
    });
    expect(result).not.toHaveProperty("portableText");
  });
  it("converts multiple choice answers", () => {});
  it.todo("converts order answers");
  it.todo("converts match answers");
});
