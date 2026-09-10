import { isQuizSection } from "./isQuizSection";

describe("isQuizSection", () => {
  it.each([
    ["starter-quiz", true],
    ["exit-quiz", true],
    ["overview", false],
    ["video", false],
  ])("returns %s for %s", (section, expected) => {
    expect(isQuizSection(section)).toBe(expected);
  });
});
