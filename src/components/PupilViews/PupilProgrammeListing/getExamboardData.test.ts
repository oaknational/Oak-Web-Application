import { getExamboardData } from "./getExamboardData";

import { ExamboardData } from "@/components/PupilComponents/BrowseExamboardSelector";

describe("getExamboardData", () => {
  it("should return the correct examboard data", () => {
    const examboardSlug = "aqa";
    const availableExamboards: ExamboardData[] = [
      {
        examboardSlug: "aqa",
        examboard: "AQA",
        examboardDisplayOrder: 1,
        isLegacy: false,
      },
      {
        examboardSlug: "edexcel",
        examboard: "Edexcel",
        examboardDisplayOrder: 2,
        isLegacy: false,
      },
    ];
    const result = getExamboardData({
      examboardSlug,
      availableExamboards,
    });
    expect(result).toEqual({
      examboardSlug: "aqa",
      examboard: "AQA",
      examboardDisplayOrder: 1,
      isLegacy: false,
    });
  });

  it("should throw an error if the examboard data is not found", () => {
    const examboardSlug = "ocr";
    const availableExamboards: ExamboardData[] = [
      {
        examboardSlug: "aqa",
        examboard: "AQA",
        examboardDisplayOrder: 1,
        isLegacy: false,
      },
      {
        examboardSlug: "edexcel",
        examboard: "Edexcel",
        examboardDisplayOrder: 2,
        isLegacy: false,
      },
    ];
    expect(() =>
      getExamboardData({
        examboardSlug,
        availableExamboards,
      }),
    ).toThrow();
  });
});
