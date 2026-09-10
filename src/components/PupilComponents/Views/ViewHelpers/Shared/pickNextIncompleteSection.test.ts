import { pickNextIncompleteSection } from "./pickNextIncompleteSection";

describe("pickNextIncompleteSection", () => {
  it("returns the first incomplete section", () => {
    expect(
      pickNextIncompleteSection({
        lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
        sectionResults: {
          intro: { isComplete: true },
          "starter-quiz": { isComplete: false },
        },
      }),
    ).toBe("starter-quiz");
  });

  it("returns review when all sections are complete", () => {
    expect(
      pickNextIncompleteSection({
        lessonReviewSections: ["intro", "starter-quiz"],
        sectionResults: {
          intro: { isComplete: true },
          "starter-quiz": { isComplete: true },
        },
      }),
    ).toBe("review");
  });
});
