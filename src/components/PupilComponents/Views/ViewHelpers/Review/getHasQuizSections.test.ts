import { getHasQuizSections } from "./getHasQuizSections";

describe("getHasQuizSections", () => {
  it.each([
    [["intro", "video"], false],
    [["intro", "starter-quiz"], true],
    [["exit-quiz"], true],
  ] as const)("returns %s for %s", (lessonReviewSections, expected) => {
    expect(getHasQuizSections(lessonReviewSections)).toBe(expected);
  });
});
