import { getIntroBottomNavLabel } from "./getIntroBottomNavLabel";

describe("getIntroBottomNavLabel", () => {
  it.each([
    [true, "Continue lesson"],
    [false, "I'm ready"],
    [undefined, "I'm ready"],
  ] as const)("returns %s state as %s", (isIntroComplete, expected) => {
    expect(getIntroBottomNavLabel(isIntroComplete)).toBe(expected);
  });
});
