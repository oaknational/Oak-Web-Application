import { getLessonResourcesMetaTitle } from "./getLessonResourcesMetaTitle";

describe("getLessonResourcesMetaTitle", () => {
  it("returns a title without tier, exam board or GCSE segment", () => {
    const result = getLessonResourcesMetaTitle({
      contentTitle: "Cells",
      keyStageSlug: "ks3",
      year: "7",
      subjectTitle: "Biology",
    });

    expect(result).toBe("Cells KS3 | Y7 Biology | Lesson Resources");
  });

  it("includes tier, exam board and GCSE segment when present", () => {
    const result = getLessonResourcesMetaTitle({
      contentTitle: "Cells",
      keyStageSlug: "ks4",
      year: "11",
      subjectTitle: "Biology",
      tierTitle: "Higher",
      examBoardTitle: "Edexcel",
      pathwayTitle: "GCSE",
    });

    expect(result).toBe(
      "Cells GCSE | KS4 | Y11 Biology Higher Edexcel | Lesson Resources",
    );
  });

  it("includes GCSE segment when tier is present but pathway is not GCSE", () => {
    const result = getLessonResourcesMetaTitle({
      contentTitle: "Cells",
      keyStageSlug: "ks4",
      year: "11",
      subjectTitle: "Biology",
      tierTitle: "Higher",
    });

    expect(result).toBe(
      "Cells GCSE | KS4 | Y11 Biology Higher | Lesson Resources",
    );
  });
});
