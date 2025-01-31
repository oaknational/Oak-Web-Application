import { getGridArea } from "./DownloadCardGroup";

describe("getGridArea", () => {
  it("returns 'auto' for 'curriculum-pdf'", () => {
    expect(getGridArea("curriculum-pdf", true)).toBe("auto");
  });

  it("returns 'presentation' for 'lesson-guide'", () => {
    expect(getGridArea("lesson-guide", true)).toBe("presentation");
  });

  it("returns the type if it is not 'worksheet-pdf' or 'worksheet-pptx'", () => {
    expect(getGridArea("intro-quiz-questions", true)).toBe(
      "intro-quiz-questions",
    );
  });

  it("returns the type if worksheetsLength is 2", () => {
    expect(getGridArea("worksheet-pdf", true, 2)).toBe("worksheet-pdf");
  });

  it("returns the type if presentation does not exist", () => {
    expect(getGridArea("worksheet-pdf", false)).toBe("worksheet-pdf");
  });

  it("returns 'presentationOrWorksheet' if worksheetsLength is not 2 and presentation exists", () => {
    expect(getGridArea("worksheet-pdf", true, 1)).toBe(
      "presentationOrWorksheet",
    );
  });
});
