import {
  convertQuestionItem,
  convertQuestionMathIdentity,
} from "./quizMathjax";

import { PortableTextText } from "@/utils/portableText";
import { StemPortableText } from "@/components/SharedComponents/Stem";

describe("convertQuestionItem", () => {
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
  it("converts mathjax", () => {
    const result = convertQuestionItem({
      type: "text",
      text: "$$sqrt{1}$$",
    });
    const portableText = (result as StemPortableText).portableText;
    expect(portableText).toBeDefined();
    expect((portableText?.[0] as PortableTextText).children?.[0]?._type).toBe(
      "math",
    );
  });
});

describe("convertQuestionMathIdentity", () => {
  it("converts quit items", () => {
    const result = convertQuestionMathIdentity([
      {
        questionId: 1,
        questionUid: "1",
        questionType: "multiple-choice",
        questionStem: [{ text: "Work out $$\\sqrt[3]{1000}$$", type: "text" }],
        answers: {
          "multiple-choice": [
            {
              answer: [{ text: "1", type: "text" }],
              answerIsCorrect: false,
            },
            {
              answer: [{ text: "10", type: "text" }],
              answerIsCorrect: true,
            },
            {
              answer: [{ text: "100", type: "text" }],
              answerIsCorrect: false,
            },
            {
              answer: [{ text: "500", type: "text" }],
              answerIsCorrect: false,
            },
          ],
        },
        feedback: "",
        hint: "",
        active: false,
      },
    ]);

    if (!result) throw new Error("convertQuestionItem result is undefined");

    expect(result[0]?.questionStem[0]?.type).toEqual("text");

    const portableText = (result[0]?.questionStem[0] as StemPortableText)
      .portableText;
    expect(portableText).toBeDefined();
  });
});
