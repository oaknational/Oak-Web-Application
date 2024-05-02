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
      },
      {
        examboardSlug: "edexcel",
        examboard: "Edexcel",
        examboardDisplayOrder: 2,
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
    });
  });

  it("should throw an error if the examboard data is not found", () => {
    const examboardSlug = "ocr";
    const availableExamboards: ExamboardData[] = [
      {
        examboardSlug: "aqa",
        examboard: "AQA",
        examboardDisplayOrder: 1,
      },
      {
        examboardSlug: "edexcel",
        examboard: "Edexcel",
        examboardDisplayOrder: 2,
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
